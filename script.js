const STORAGE_KEY = "ai_reelshorts_prompt_control_v1";
const APP_CONFIG = window.PromptControlConfig || { apiBaseUrl: "" };
const KNOWLEDGE_CORE = window.KnowledgeCore;
const KNOWLEDGE_INGESTION = window.KnowledgeIngestion;
const PERFORMANCE_DIRECTOR = window.PerformanceDirector;
const PERFORMANCE_PLANNER = window.PerformancePlanner;
const PERFORMANCE_DATA = window.PerformanceExampleData || { stats: {}, examples: [] };

const TEXT_MODEL_OPTIONS = [
  { id: "local", label: "本地专业引擎", description: "不调用API，零成本生成。", available: true },
  { id: "deepseek-v3", label: "DeepSeek V3（官方API已不可用）", description: "当前账户不再提供独立V3模型。", available: false },
  { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash", description: "速度快、成本低，推荐日常使用。", available: true },
  { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro", description: "适合复杂剧情与高精度方案。", available: true },
];

if (!KNOWLEDGE_CORE || !KNOWLEDGE_INGESTION || !PERFORMANCE_DIRECTOR || !PERFORMANCE_PLANNER) {
  throw new Error("知识库组件未加载，请刷新页面后重试。");
}

const NAV_ITEMS = [
  { id: "workbench", label: "工作台", icon: "wand-sparkles", title: "提示词创建工作台" },
  { id: "roles", label: "角色资产", icon: "user-round-cog", title: "角色资产库" },
  { id: "modules", label: "存储库", icon: "database", title: "提示词存储库" },
  { id: "ingestion", label: "资料导入", icon: "file-up", title: "知识摄入中心" },
  { id: "presets", label: "预设库", icon: "library", title: "预设提示词库" },
  { id: "tags", label: "分类标签", icon: "tags", title: "分类与标签管理" },
  { id: "models", label: "模型配置", icon: "cpu", title: "模型配置" },
];

const WORKBENCH_MODES = [
  { id: "image", label: "图片提示词", icon: "image", title: "图片提示词工作台" },
  { id: "video", label: "视频提示词", icon: "clapperboard", title: "视频提示词工作台" },
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

const DEFAULT_MODULE_QUICK_TYPES = ["lighting", "camera", "action", "expression", "texture", "negative"];

const AI_BREAKDOWN_SECTIONS = [
  { id: "sceneSpace", label: "场景空间", icon: "map", target: "frameDescription" },
  { id: "lightingMood", label: "光影氛围", icon: "lightbulb", target: "lightingControl" },
  { id: "colorLogic", label: "色彩逻辑", icon: "palette" },
  { id: "cameraParams", label: "相机参数", icon: "camera" },
  { id: "blocking", label: "人物站位", icon: "users", target: "blocking" },
  { id: "action", label: "人物动作", icon: "move-3d", target: "actionDetail" },
  { id: "microExpression", label: "微表情", icon: "sparkles", target: "expressionDetail" },
  { id: "cameraMotion", label: "镜头运动", icon: "scan-eye", target: "cameraSpeed" },
  { id: "texture", label: "画面质感", icon: "image", target: "texture" },
  { id: "negative", label: "负面约束", icon: "shield-x", target: "customNegative" },
];

const RESULT_CARD_TYPES = [
  { id: "projectStyle", label: "项目风格", icon: "folder-kanban", moduleType: "style" },
  { id: "sceneSpace", label: "场景空间", icon: "map", moduleType: "scene" },
  { id: "lightingMood", label: "光影氛围", icon: "lightbulb", moduleType: "lighting" },
  { id: "cameraParams", label: "相机参数", icon: "camera", moduleType: "camera" },
  { id: "action", label: "人物动作", icon: "move-3d", moduleType: "action" },
  { id: "microExpression", label: "微表情", icon: "sparkles", moduleType: "expression" },
  { id: "lensLanguage", label: "镜头语言", icon: "scan-eye", moduleType: "camera" },
  { id: "texture", label: "画面质感", icon: "image", moduleType: "texture" },
  { id: "negative", label: "负面提示词", icon: "shield-x", moduleType: "negative" },
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

const IMAGE_TASKS = [
  "完整图片提示词",
  "角色定妆图",
  "场景概念图",
  "光影氛围图",
  "相机参数复刻",
  "封面海报图",
];

const VIDEO_TASKS = [
  "完整视频画面提示词",
  "场景光影与相机参数",
  "人物动作设计",
  "人物行为逻辑",
  "微表情设计",
  "镜头运动",
  "分镜 / 镜头序列",
  "角色一致性约束",
  "负面提示词",
];

const QUICK_START_TASKS = [
  {
    type: "角色提示词",
    label: "角色一致性提示词",
    description: "固定发型、脸型、服装、气质，减少角色跑偏。",
  },
  {
    type: "完整画面提示词",
    label: "单镜头画面提示词",
    description: "适合生成首帧图、单张画面或单个视频镜头。",
  },
  {
    type: "动作提示词",
    label: "动作与站位提示词",
    description: "控制人物在哪里、怎么动、和谁互动。",
  },
  {
    type: "微表情提示词",
    label: "微表情提示词",
    description: "控制眼神、嘴角、呼吸、停顿等情绪细节。",
  },
  {
    type: "光影提示词",
    label: "光影氛围提示词",
    description: "控制电影感、逆光、窗边光、冷暖色调。",
  },
  {
    type: "视频分镜提示词",
    label: "完整分镜提示词",
    description: "把一段剧情拆成多个可生成镜头。",
  },
];

const PROMPT_TYPE_BUTTONS = [
  { label: "完整画面", value: "完整画面提示词" },
  { label: "角色", value: "角色提示词" },
  { label: "镜头", value: "镜头提示词" },
  { label: "动作", value: "动作提示词" },
  { label: "微表情", value: "微表情提示词" },
  { label: "光影", value: "光影提示词" },
  { label: "负面", value: "负面提示词" },
  { label: "分镜", value: "视频分镜提示词" },
];

const QUICK_SCENES = [
  "人物登场",
  "情绪爆发",
  "对话冲突",
  "回忆闪回",
  "转身离开",
  "沉默对视",
  "战斗前夕",
  "亲密互动",
  "发现真相",
  "强忍情绪",
];

const CHARACTER_STATES = ["平静", "克制", "愤怒", "委屈", "震惊", "心虚", "崩溃", "冷漠", "犹豫", "压抑"];
const RELATION_TENSIONS = ["对峙", "疏离", "试探", "压迫", "误会", "暧昧", "冲突", "背叛", "和解前夕"];
const SHOT_SIZES = ["特写", "近景", "中景", "远景", "过肩拍", "背影", "全景"];
const CAMERA_ANGLES = ["平视", "低角度", "高角度", "侧脸", "斜侧方", "主观视角", "俯拍", "仰拍"];
const COMPOSITIONS = ["居中构图", "三分法", "留白压迫", "前景遮挡", "门框构图", "镜中反射", "人物偏左", "人物偏右"];
const BLOCKING_OPTIONS = ["单人居中", "双人对峙", "一前一后", "背对背", "女主在前，男主在后", "角色在画面边缘", "角色被环境压迫"];
const ACTION_OPTIONS = ["抬眼", "后退半步", "攥紧手指", "转身离开", "停顿三秒", "慢慢靠近", "轻微低头", "欲言又止", "伸手又收回"];
const EYE_OPTIONS = ["躲闪", "冷淡", "湿润", "失焦", "压迫", "震惊", "疲惫", "隐忍"];
const MOUTH_OPTIONS = ["嘴唇紧抿", "微微颤抖", "冷笑", "欲言又止", "下意识抿唇"];
const BREATH_OPTIONS = ["屏住呼吸", "呼吸急促", "轻轻叹气", "压抑喘息", "呼吸变慢"];
const LIGHTING_OPTIONS = ["冷光", "暖光", "逆光", "窗边光", "月光", "烛光", "顶光", "侧逆光", "柔和散射光", "高对比阴影"];
const ATMOSPHERE_OPTIONS = ["压抑", "高级", "悬疑", "浪漫", "孤独", "危险", "梦幻", "冷峻", "破碎感"];
const TEXTURE_OPTIONS = ["电影感", "超写实", "浅景深", "高对比", "柔焦", "颗粒感", "电视剧质感", "高级广告感"];

const PARAMETER_GROUPS = [
  { key: "aspectRatio", label: "画幅比例", options: ["1:1", "16:9", "9:16", "4:5", "3:4", "21:9"] },
  { key: "quality", label: "画面质量", options: ["标准", "高质量", "超写实"] },
  { key: "styleStrength", label: "风格强度", options: ["弱", "中", "强"] },
  { key: "motionLevel", label: "运动幅度", options: ["静态", "轻微", "中等", "明显"] },
  { key: "cameraSpeed", label: "镜头速度", options: ["慢", "中", "快"] },
  { key: "emotionIntensity", label: "情绪强度", options: ["克制", "中等", "强烈"] },
];

const NEGATIVE_OPTIONS = [
  "不要变脸",
  "不要改变发型",
  "不要夸张表情",
  "不要卡通化",
  "不要多余手指",
  "不要肢体扭曲",
  "不要过度磨皮",
  "不要文字水印",
  "不要画面崩坏",
  "不要低清晰度",
];

const OPTIMIZE_ACTIONS = [
  { id: "cinematic", label: "更电影感", zh: "强化电影级布光、浅景深、真实胶片颗粒与高级短剧剧照质感。", en: "cinematic lighting, shallow depth of field, realistic film still, subtle film grain" },
  { id: "realistic", label: "更真实", zh: "降低网感和过度修饰，保留真实皮肤纹理、自然动作和物理细节。", en: "more realistic skin texture, natural motion, physical detail, no synthetic look" },
  { id: "micro", label: "增强微表情", zh: "加强眼神、嘴角、呼吸、下颌和停顿的细腻变化，避免夸张表演。", en: "enhanced micro-expression, subtle eyes, lips, breath, jaw tension, restrained acting" },
  { id: "restrain", label: "降低夸张程度", zh: "降低表演幅度，保持情绪克制、动作自然、表情不过火。", en: "restrained performance, natural movement, subtle emotional intensity" },
  { id: "lighting", label: "增强光影层次", zh: "强化主光方向、色温、阴影形态、暗部细节和冷暖关系。", en: "layered lighting, motivated key light, color temperature contrast, detailed shadows" },
  { id: "consistency", label: "增强角色一致性", zh: "锁定角色固定项、脸型、发型、服装主色、气质和禁止变化项。", en: "strong character consistency, fixed facial structure, hair, outfit palette, temperament" },
  { id: "english", label: "改成英文", zh: "输出优先使用英文提示词结构，保留中文备注作为参考。", en: "convert to a concise English generation prompt" },
  { id: "bilingual", label: "改成中英双语", zh: "输出中文和英文两套提示词，便于不同模型调用。", en: "provide bilingual Chinese and English prompts" },
  { id: "kling", label: "适配可灵", zh: "强调视频运动连续性、人物动作自然度、镜头节奏和角色一致性。", en: "optimized for Kling-style video generation, coherent motion and stable character identity" },
  { id: "jimeng", label: "适配即梦", zh: "强调中文语义清晰、镜头拆解明确、画面目标和负面约束完整。", en: "clear Chinese semantic structure, shot breakdown, full negative constraints" },
  { id: "midjourney", label: "适配 Midjourney", zh: "强化图像关键词、构图、光影、风格参数和画幅表达。", en: "Midjourney-ready visual keywords, composition, lighting, style and aspect ratio" },
];

const GENERATOR_CATEGORIES = [
  { id: "styles", label: "风格", icon: "image", groups: [{ label: "画面风格", key: "texture", options: TEXTURE_OPTIONS }] },
  { id: "lighting", label: "光影", icon: "lightbulb", groups: [{ label: "光线", key: "lightingControl", options: LIGHTING_OPTIONS }, { label: "氛围", key: "atmosphere", options: ATMOSPHERE_OPTIONS }] },
  { id: "camera", label: "相机", icon: "camera", groups: [{ label: "景别", key: "shotSize", options: SHOT_SIZES }, { label: "机位", key: "cameraAngle", options: CAMERA_ANGLES }, { label: "构图", key: "composition", options: COMPOSITIONS }] },
  { id: "action", label: "动作", icon: "move-3d", groups: [{ label: "站位", key: "blocking", options: BLOCKING_OPTIONS }, { label: "动作", key: "action", options: ACTION_OPTIONS }] },
  { id: "expression", label: "微表情", icon: "sparkles", groups: [{ label: "角色状态", key: "characterState", options: CHARACTER_STATES }, { label: "眼神", key: "eye", options: EYE_OPTIONS }, { label: "嘴部", key: "mouth", options: MOUTH_OPTIONS }, { label: "呼吸", key: "breath", options: BREATH_OPTIONS }] },
  { id: "negative", label: "负面提示词", icon: "shield-x", groups: [] },
];

const DEFAULT_STATE = {
  theme: "dark",
  activeView: "workbench",
  resultTab: "zh",
  preferences: {
    moduleQuickTypeIds: DEFAULT_MODULE_QUICK_TYPES,
  },
  activeProjectId: "project-default-cinematic",
  workbench: {
    mode: "video",
    imageTask: "完整图片提示词",
    videoTask: "完整视频画面提示词",
    promptType: "完整画面提示词",
    roleId: "role-lin",
    goal: "情绪爆发",
    sourceBrief: "女主在夜色窗边压住愤怒，准备说出真相。",
    referenceImageName: "",
    referenceNote: "如果上传场景图，优先识别空间、主光源、色彩倾向、镜头景别和人物站位。",
    sceneGoal: "女主在夜色窗边压住愤怒，准备说出真相。",
    frameDescription: "近景，人物站在窗边，窗外是雨夜城市光，室内光线克制。",
    extra: "保持人物真实自然，不要夸张表演，镜头要有高级短剧电影感。",
    outputFormat: "中英双语",
    targetTool: "可灵",
    quickTask: "单镜头画面提示词",
    activeCategory: "lighting",
    characterState: "克制",
    relationTension: "对峙",
    shotSize: "近景",
    cameraAngle: "平视",
    composition: "留白压迫",
    blocking: "角色在画面边缘",
    action: "攥紧手指",
    actionDetail: "她的手指轻轻攥紧衣角，但脸上仍然保持克制。",
    eye: "隐忍",
    mouth: "嘴唇紧抿",
    breath: "屏住呼吸",
    expressionDetail: "眼尾微红，但不要哭出来。",
    lightingControl: "窗边光",
    atmosphere: "压抑",
    texture: "电影感",
    aspectRatio: "9:16",
    quality: "高质量",
    styleStrength: "中",
    motionLevel: "轻微",
    cameraSpeed: "慢",
    emotionIntensity: "克制",
    negativeOptions: NEGATIVE_OPTIONS.slice(),
    customNegative: "",
    optimizationNotes: [],
    lockedRecallIds: [],
    selectedKnowledgeEntryIds: [],
    performanceDuration: 2.5,
    textModelId: "local",
    textModelThinking: false,
    performanceRecall: {
      lockedIds: [],
      selectedIds: [],
    },
    performancePlan: {
      generatedAt: "",
      sourceSignature: "",
      plans: [],
      selectedPlanId: "",
      lockedPlanId: "",
      customPrompts: {},
      generatorLabel: "本地专业引擎",
      fallbackReason: "",
      usage: null,
    },
    aiBreakdown: {
      generatedAt: "",
      source: "",
      selectedOptionIds: {},
      customValues: {},
      cards: [],
    },
    resultCards: {
      lockedIds: [],
      cards: {},
    },
    selectedModuleIds: {
      scene: "module-scene-window",
      camera: "module-camera-close",
      action: "module-action-controlled",
      expression: "module-expression-principle",
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
  knowledge: KNOWLEDGE_CORE.createEmptyKnowledgeState(),
  projects: [
    {
      id: "project-default-cinematic",
      name: "默认高级短剧风格",
      visualTone: "写实真人电影感，高级短剧质感，克制、真实、低网感。",
      colorLogic: "低饱和黑白灰紫基调，保留冷暖对比；肤色真实，不偏塑料感。",
      lightingPreference: "偏好窗边光、侧逆光、柔和电影光、高对比但暗部细节完整。",
      lensLanguage: "以近景、过肩拍、稳定轻推镜头为主，突出人物眼神、手部和肩颈细节。",
      characterTexture: "真实皮肤纹理、自然妆容、不过度磨皮，人物五官稳定。",
      filmGrain: "细腻胶片颗粒，8K写实剧照质感，避免CGI和渲染感。",
      defaultNegative: "不要廉价网感，不要塑料皮肤，不要过度柔焦，不要五官漂移，不要夸张表情，不要低清晰度。",
      defaultModel: "可灵",
      defaultAspectRatio: "9:16",
      updatedAt: "2026-06-24",
    },
  ],
  tags: [
    "女主",
    "男主",
    "ReelShort",
    "电影感",
    "存储库",
    "微表情资产",
    "情绪拆解",
    "表演控制",
    "喜悦",
    "哀伤",
    "淡漠",
    "复杂情绪",
    "震惊错愕",
    "飞书参考",
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
    "电影静帧提取",
    "光影资产",
    "美式西部",
    "荒漠黄昏",
    "时尚职场",
    "高层办公室",
    "美式公寓",
    "英伦庄园",
    "自然漫射光",
    "条状光影",
    "蓝调时刻",
    "ARRI",
    "Cooke",
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
      id: "module-expression-principle",
      name: "微表情拆解总纲",
      type: "expression",
      zh: "生成微表情时不要只写一个情绪词，必须先判断情绪大类：喜悦、哀伤、淡漠与复杂、愤怒、震惊错愕；再拆成情绪根因、情绪强度、眼神焦点、眉部压力、嘴部控制、呼吸节奏、下颌/肩颈张力、停顿时长、动作延迟和禁止项。输出应保持真人电影表演逻辑，以细微、克制、可被镜头捕捉的变化为主，避免夸张哭笑、五官大幅变形和舞台剧式表演。",
      en: "When generating micro-expressions, do not use a single emotion word. First identify the emotion family: joy, grief, indifference/complexity, anger, or shock; then break it down into emotional cause, intensity, eye focus, brow tension, mouth control, breathing rhythm, jaw/neck/shoulder tension, pause duration, delayed action, and constraints. Keep the performance grounded in live-action cinematic acting: subtle, restrained, camera-readable changes, avoiding exaggerated crying, laughing, facial distortion, or theatrical acting.",
      tags: ["微表情资产", "情绪拆解", "表演控制", "存储库", "飞书参考"],
      scenarios: "所有人物近景、情绪戏、对话冲突、视频提示词生成",
      favorite: true,
      uses: 1,
      notes: "作为微表情类型的总纲词条，每次调用AI时优先参考，再叠加具体情绪词条。",
      updatedAt: "2026-06-21",
    },
    {
      id: "module-expression-grievance-restrained",
      name: "委屈但不失控的微表情",
      type: "expression",
      zh: "眼眶轻微湿润，视线短暂下沉后又强行抬起，眉心有极轻的收缩，嘴角向下压但不颤哭，喉结/下颌有吞咽感，呼吸变浅，整体像是在把委屈压回去，不要嚎哭或泪流满面。",
      en: "Eyes slightly moist, gaze briefly drops then forces itself back up, a faint contraction between the brows, mouth corners pressed downward without sobbing, a swallowed tension in the throat or jaw, shallow breathing, as if pushing grievance back down; no wailing or streaming tears.",
      tags: ["委屈", "克制", "眼眶湿润", "微表情资产"],
      scenarios: "误会、被质问、亲密关系受伤、真相前奏",
      favorite: true,
      uses: 1,
      notes: "重点是湿润感和吞咽感，不要变成大哭戏。",
      updatedAt: "2026-06-21",
    },
    {
      id: "module-expression-shock-freeze",
      name: "震惊后的短暂停滞",
      type: "expression",
      zh: "瞳孔和眼神出现短暂停滞，眨眼频率降低，眉毛轻微上提后迅速压住，嘴唇微张但没有夸张张大，呼吸停半拍，肩颈僵住一瞬，随后情绪被角色强行收回。",
      en: "A brief frozen look in the eyes, reduced blinking, brows lift slightly then are quickly controlled, lips part subtly without a wide-open mouth, breath pauses for half a beat, neck and shoulders stiffen for an instant, then the emotion is forced back under control.",
      tags: ["震惊", "停顿", "克制", "微表情资产"],
      scenarios: "发现真相、反转、被背叛、听到关键线索",
      favorite: true,
      uses: 1,
      notes: "用于反转瞬间，核心是半拍停滞和迅速压回情绪。",
      updatedAt: "2026-06-21",
    },
    {
      id: "module-expression-suspicion-probing",
      name: "怀疑试探的微表情",
      type: "expression",
      zh: "眼神先停在对方脸上再轻微偏移，眉尾有细小收紧，嘴角几乎不动，只保留一点审视感，呼吸平稳但语气前有短暂停顿，下颌微收，整体呈现克制的怀疑和试探。",
      en: "The gaze holds on the other person's face, then shifts slightly away; the tail of the brow tightens subtly, mouth corners barely move with a trace of scrutiny, breathing remains steady with a short pause before speaking, jaw slightly tucked, conveying restrained suspicion and probing.",
      tags: ["怀疑", "试探", "对峙", "微表情资产"],
      scenarios: "对话试探、审问、权力博弈、隐藏真相",
      favorite: true,
      uses: 1,
      notes: "适合高级对话戏，避免翻白眼、挑眉过度。",
      updatedAt: "2026-06-21",
    },
    {
      id: "module-expression-cold-withheld",
      name: "冷漠疏离的微表情",
      type: "expression",
      zh: "眼神稳定但不贴近对方，面部肌肉放松到近乎无表情，嘴唇保持自然闭合，下颌线清晰，眨眼节奏慢，呼吸平稳，情绪被完全收在表层之下，呈现礼貌、疏离、不可接近的冷感。",
      en: "Steady eyes that do not emotionally reach the other person, facial muscles relaxed into an almost neutral expression, lips naturally closed, clear jawline, slow blinking, steady breathing, emotion held entirely beneath the surface, polite, distant, and unreachable.",
      tags: ["冷漠", "疏离", "克制", "微表情资产"],
      scenarios: "分手、权力压制、职场对峙、关系破裂",
      favorite: true,
      uses: 1,
      notes: "冷感来自疏离和静止，不是僵硬面瘫。",
      updatedAt: "2026-06-21",
    },
    {
      id: "module-expression-collapse-contained",
      name: "崩溃边缘但强行维持",
      type: "expression",
      zh: "眼神短暂失焦后重新聚焦，呼吸开始不稳但被压低，嘴唇轻颤一次后紧抿，下颌微微发紧，肩膀有极小幅度下沉，人物像快要崩溃但仍强行保持体面，不要夸张哭喊。",
      en: "The eyes briefly lose focus then refocus, breathing becomes unstable but is pushed down, lips tremble once then press tight, jaw tightens subtly, shoulders sink by a tiny degree, as if the character is near collapse while still forcing composure; no exaggerated crying or shouting.",
      tags: ["崩溃", "强忍", "内心戏", "微表情资产"],
      scenarios: "情绪临界点、真相揭露后、失去重要关系、复仇失败",
      favorite: true,
      uses: 1,
      notes: "用于强戏剧张力，建议搭配近景或特写。",
      updatedAt: "2026-06-21",
    },
    {
      id: "module-expression-library-joy",
      name: "喜悦类微表情类型库",
      type: "expression",
      zh: "喜悦类不要只写“开心”，应按强度拆分：开怀大笑可写嘴角自然拉开、露齿、眼尾挤出真实笑纹、头部微后仰；欣慰浅笑可写眉眼舒展、嘴角缓慢上扬、眼神释然柔和；释然满足可写轻叹、下颌放松、面部肌肉松弛；宠溺深情可写目光稳定温柔、眼周肌肉柔和包裹、面部线条温润；得意或窃喜可写单侧嘴角轻扬、眼神灵动、视线轻微躲闪、笑意被刻意压住。整体保持真人自然感，避免廉价夸张笑容。",
      en: "For joy, avoid simply writing happy. Split by intensity: open laughter with naturally stretched mouth corners, visible teeth, real crow's-feet, and a slight backward head tilt; relieved smile with relaxed brows, slowly lifted mouth corners, and soft eyes; content relief with a small exhale, relaxed jaw, and loosened facial muscles; affectionate tenderness with stable warm eye contact and softened eye muscles; smug or secret delight with one mouth corner lifted, lively eyes, slight gaze avoidance, and suppressed laughter. Keep it natural and live-action, not cheap or exaggerated.",
      tags: ["喜悦", "微表情资产", "情绪拆解", "飞书参考"],
      scenarios: "开心、释然、宠溺、窃喜、默契、悲喜交加",
      favorite: true,
      uses: 1,
      notes: "喜悦类重点看眼尾、苹果肌、嘴角和头部松弛度，避免空泛写笑。",
      updatedAt: "2026-06-24",
    },
    {
      id: "module-expression-library-sorrow",
      name: "哀伤类微表情类型库",
      type: "expression",
      zh: "哀伤类要区分破碎、疲惫、委屈、强忍和宣泄：极致破碎可写眼神空洞失焦、面部失血色、肌肉下垂、嘴唇苍白微张；无声滑泪可写表情异常平静、眉头轻蹙、眼泪自然滑落；低声啜泣可写嘴角轻颤、鼻头泛红、眼神低垂；委屈憋泪可写眼眶泛红、下唇轻抿、眉心微蹙、泪水不落；强颜欢笑可写嘴角被迫上扬但眼角下垂，呈现上下拉扯的矛盾感。整体要克制、真实、内敛。",
      en: "For sorrow, separate brokenness, exhaustion, grievance, restraint, and release: extreme heartbreak uses hollow unfocused eyes, bloodless face, sagging facial muscles, and pale parted lips; silent tears use an unusually calm face, slight brow tension, and tears sliding naturally; quiet sobbing uses trembling mouth corners, a red nose, and lowered eyes; suppressed grievance uses red eyes, pressed lower lip, slight brow pinch, and tears held back; forced smile uses lifted mouth corners but drooping eyes, creating a contradictory pull. Keep it restrained, real, and internalized.",
      tags: ["哀伤", "委屈", "强忍", "微表情资产", "飞书参考"],
      scenarios: "无声滑泪、强忍落泪、委屈、防备、失落、疲惫、悲喜交加",
      favorite: true,
      uses: 1,
      notes: "哀伤类核心不是哭得多，而是眼眶、嘴角、鼻头和肌肉下垂的真实程度。",
      updatedAt: "2026-06-24",
    },
    {
      id: "module-expression-library-indifference-complex",
      name: "淡漠与复杂类微表情类型库",
      type: "expression",
      zh: "淡漠与复杂类要写出“静态里的信息量”：平静淡然可写眉眼无起伏、眼神沉静、面部松弛；高冷疏离可写嘴角平直、眼神清冷、下颌线利落、面部无多余情绪；厌世或防御感可写直视前方、眼神无波澜、气场生人勿近；若有所思可写目光游离镜头外、眉心浅拢、嘴唇轻抿、眼神活跃；社交防御笑可写标准微笑但眼轮匝肌不参与，眼神冷静无波澜；审视打量可写微眯眼、头部轻倾、嘴角平直、目光带评估和压迫感。",
      en: "For indifference and complex emotions, write information inside stillness: calm neutrality with steady eyes and relaxed face; cold distance with straight mouth corners, cool eyes, sharp jawline, and no extra emotion; detached or defensive aura with a direct emotionless gaze and an unapproachable presence; deep thought with gaze outside the camera, slight brow pinch, pressed lips, and active eyes; social defensive smile with a standard mouth smile but inactive eye muscles; scrutiny with narrowed eyes, slight head tilt, flat mouth, and evaluative pressure.",
      tags: ["淡漠", "复杂情绪", "疏离", "审视", "微表情资产", "飞书参考"],
      scenarios: "冷漠、厌世、社交伪装、思考、审视、警惕、防备",
      favorite: true,
      uses: 1,
      notes: "这类最适合高级短剧近景，关键是克制和信息密度。",
      updatedAt: "2026-06-24",
    },
    {
      id: "module-expression-library-anger",
      name: "愤怒类微表情类型库",
      type: "expression",
      zh: "愤怒类要分清外放、压抑、冷怒和不耐：外放愤怒可写眉头紧锁、双眼圆睁直视、瞳孔聚焦、面部肌肉紧绷；严肃愠怒可写双目平视紧盯、眉眼紧绷、气场沉稳不怒自威；压抑愠怒可写眉间浅川字纹、眉骨下沉、眼神沉冷、鼻翼微收、嘴角向下抿紧、咬肌微绷；冷怒可写面部异常平静、瞳孔微放大、视线锁定目标、呼吸放缓、嘴角紧绷；不耐烦可写眼睑微沉、眉头短促皱起、嘴唇紧闭并向外呼气。避免把所有愤怒都写成大吼大叫。",
      en: "For anger, distinguish outward anger, suppressed anger, cold anger, and impatience: outward anger uses locked brows, wide focused eyes, and tense facial muscles; stern displeasure uses direct steady gaze, tightened brows, and quiet authority; suppressed anger uses a shallow frown line, lowered brow bone, cold controlled eyes, slightly tightened nostrils, pressed mouth corners, and tense jaw muscles; cold anger uses an unusually calm face, slightly dilated pupils, locked gaze, slowed breathing, and pale tight lips; impatience uses lowered eyelids, quick brow tension, closed lips, and an outward exhale. Avoid turning all anger into shouting.",
      tags: ["愤怒", "冷怒", "不耐", "压抑", "微表情资产", "飞书参考"],
      scenarios: "压抑愠怒、暴雨前夕的冷怒、严肃直视、烦躁不耐、咬牙隐忍",
      favorite: true,
      uses: 1,
      notes: "愤怒类要优先判断是否需要爆发；短剧高级感通常来自压住怒意。",
      updatedAt: "2026-06-24",
    },
    {
      id: "module-expression-library-shock",
      name: "震惊错愕类微表情类型库",
      type: "expression",
      zh: "震惊错愕类要写出反应阶段：侧目意外可写头部轻微侧转、眉眼同步抬起、眼神错愕聚焦；难以置信可写双眼微睁、瞳孔轻收、眉峰抬起、嘴巴自然微张；错愕失神可写眼神瞬间空洞、面部肌肉定格、无多余动作；猝然受惊可写上眼睑上扬、眼神慌乱闪躲、面部微绷；惊恐后怕可写瞳孔放大、嘴唇微张、急促呼吸、额头细汗、面部苍白僵硬。先写半拍停顿，再写后续恢复或失控。",
      en: "For shock and astonishment, describe reaction stages: side-glance surprise with a slight head turn, raised brows and widened eyes, and focused astonishment; disbelief with slightly widened eyes, subtle pupil contraction, raised brows, and naturally parted lips; stunned blankness with suddenly hollow eyes, frozen facial muscles, and no extra movement; sudden fright with lifted upper eyelids, chaotic gaze avoidance, and slight facial tension; post-fear reaction with dilated pupils, parted lips, quick breathing, tiny forehead sweat, and a pale stiff face. Write the half-beat pause first, then the recovery or loss of control.",
      tags: ["震惊错愕", "受惊", "难以置信", "微表情资产", "飞书参考"],
      scenarios: "反转、发现真相、听到意外消息、惊恐后怕、错愕失神",
      favorite: true,
      uses: 1,
      notes: "震惊类最重要的是阶段感：先停住，再聚焦或失焦。",
      updatedAt: "2026-06-24",
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
      id: "module-light-western-desert-dusk",
      name: "美式西部荒漠黄昏侧逆光",
      type: "lighting",
      zh: "美式西部荒漠黄昏场景，荒野公路与荒凉戈壁地貌，黄金时刻日落侧逆光，暖橙金色低角度斜射光线，柔和丁达尔光，地面铺满长阴影；天空呈暖橘粉渐变晚霞，同时带有蓝调时刻的清冷，薄云层次丰富；整体暖冷色搭配，低饱和度，柔和明暗对比，荒凉孤寂、浪漫、隐忍、暗流涌动。",
      en: "An American western desert dusk scene on a lonely highway and barren Gobi terrain, golden-hour sunset side backlight, warm orange-gold low-angle raking light, soft Tyndall rays, long shadows across the ground; warm orange-pink gradient sunset sky with a cool blue-hour undertone and layered thin clouds; warm-cool cinematic palette, low saturation, gentle contrast, lonely, romantic, restrained, and tense.",
      tags: ["美式西部", "荒漠黄昏", "蓝调时刻", "逆光", "电影感", "光影资产"],
      scenarios: "西部公路片、逃亡、宿命感、角色独行、冲突爆发前",
      favorite: true,
      uses: 1,
      notes: "核心是暖橙日落与蓝调时刻并存，用温柔日落反衬荒野空旷和未知前路。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-light-fashion-office-cool",
      name: "曼哈顿高层办公室清冷漫射光",
      type: "lighting",
      zh: "曼哈顿高层办公室内景，午后自然光透过大面积落地窗漫射进房间，柔和均匀的侧方柔光，整体明亮通透，冷调偏白的干净光影，无生硬阴影；以冷调白、米、灰为基底，搭配深色服装形成克制高对比，低对比度电影质感，柔和高光与细腻阴影，营造专业、疏离、精致且有压迫感的时尚职场氛围。",
      en: "A Manhattan high-rise office interior, afternoon natural light diffused through large floor-to-ceiling windows, soft even side light, bright and transparent overall, cool clean white-toned lighting with no harsh shadows; a palette based on cool white, beige, and gray, contrasted with dark clothing, low-contrast cinematic texture, soft highlights and delicate shadows, creating a professional, distant, refined, and quietly oppressive fashion-office mood.",
      tags: ["时尚职场", "高层办公室", "自然漫射光", "低对比度", "电影感", "光影资产"],
      scenarios: "办公室权威、职场压迫、时尚圈、对称构图、克制对话",
      favorite: true,
      uses: 1,
      notes: "核心是大窗漫射光、清冷白灰基底、秩序感和疏离感。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-light-luxury-apartment-afternoon",
      name: "高档美式公寓午后条状光影",
      type: "lighting",
      zh: "高档美式公寓室内场景，大面积高窗漫射侧方自然光，暖金色午后阳光斜洒进房间，在地板和家具上形成清晰条状光影；整体色调柔和，分为冷调灰绿、暖调米黄、复古暖棕三层色彩，低饱和莫兰迪色系，光影层次丰富，明暗过渡自然，柔和阴影与通透高光，慵懒温馨又高级。",
      en: "A luxury American apartment interior with large high windows diffusing side natural light, warm golden afternoon sunlight slanting into the room and forming clear striped light and shadow across the floor and furniture; soft overall tone with three color layers: cool gray-green, warm beige-yellow, and vintage warm brown, low-saturation Morandi palette, rich light layers, natural tonal transitions, soft shadows and transparent highlights, lazy, warm, and premium.",
      tags: ["美式公寓", "条状光影", "自然漫射光", "莫兰迪", "高级感", "光影资产"],
      scenarios: "室内情感戏、慵懒午后、亲密互动、人物独处",
      favorite: true,
      uses: 1,
      notes: "调色重点：色温4000-4800K，整体提亮，压高光、提阴影，大幅降低对比度，绿色偏青并提高明亮度。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-light-british-estate-spring",
      name: "英伦庄园春日通透自然光",
      type: "lighting",
      zh: "英伦庄园场景，明亮通透的春日自然光，高饱和度青草绿与纯净天空蓝作为基底，柔和侧方柔光勾勒人物轮廓，草地反射出柔和光斑，光影过渡干净自然，无生硬阴影；整体色调清新明快、温润柔和，低对比度复古胶片质感，画面通透干净，醒目但不艳俗。",
      en: "A British manor estate scene with bright transparent spring natural light, saturated grass green and pure sky blue as the base palette, soft side light outlining the character, gentle reflected light spots from the lawn, clean natural light transitions with no harsh shadows; fresh, bright, warm and soft overall tone, low-contrast vintage film texture, clean transparent image, vivid but never gaudy.",
      tags: ["英伦庄园", "自然漫射光", "春日", "复古胶片", "低对比度", "光影资产"],
      scenarios: "庄园、春日外景、浪漫、轻喜剧、人物关系缓和",
      favorite: true,
      uses: 1,
      notes: "核心是春日自然光、草地反射光、侧方柔光和绿蓝基底。",
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
      id: "module-style-arri-cooke-cinema-camera",
      name: "ARRI / Cooke 写实电影机参数",
      type: "style",
      zh: "写实真人电影画质；阿莱艾美拉摄影机拍摄，竖屏构图（Vertical composition），极具情绪张力与物理细节真实感；raw photo, film grain, 8K, no CGI, no rendering, no smooth surface；24fps，EI/ASA 800，Log-C伽马，库克35mm定焦镜头S8/i系列，光圈T1.4，快门角度180°，记录格式ProRes 4444 XQ / ARRIRAW；根据场景指定白平衡与色温：办公室/通用5500K，公寓4000-4800K或4200K偏冷，英伦庄园5600K，荒漠黄昏可用8500K蓝调时刻白平衡；曝光补偿+0.3至+0.7档，暗部细节完整。",
      en: "Realistic live-action cinematic image quality; shot on an ARRI Amira camera, vertical composition, strong emotional tension and physically realistic details; raw photo, film grain, 8K, no CGI, no rendering, no smooth surface; 24fps, EI/ASA 800, Log-C gamma, Cooke 35mm prime lens S8/i series, T1.4 aperture, 180-degree shutter angle, ProRes 4444 XQ / ARRIRAW recording; set white balance and color temperature by scene: office/general 5500K, apartment 4000-4800K or cool 4200K, British estate 5600K, desert dusk 8500K blue-hour white balance; exposure compensation +0.3 to +0.7 stops, preserving shadow detail.",
      tags: ["ARRI", "Cooke", "电影机参数", "8K", "写实", "光影资产"],
      scenarios: "所有写实AI短视频画面提示词、光影提示词、电影静帧复刻",
      favorite: true,
      uses: 1,
      notes: "作为全局相机参数预设，不负责具体情绪和场景光线。",
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
    {
      id: "module-format-lighting-still-extraction",
      name: "电影静帧光影提取输出结构",
      type: "format",
      zh: "后续从电影静帧提取光影提示词时，统一按以下结构输出：1. 光影氛围：场景、时间、主光源、光线方向、硬软程度、阴影形态、天空/环境光；2. 色彩逻辑：主色基底、辅助色、冷暖关系、饱和度、色彩对比；3. 曝光与调色：色温、白平衡、对比度、曝光、高光、阴影、白色色阶、黑色色阶、饱和度、清晰度；4. 场景氛围：空间质感、构图、景深、清晰度、胶片颗粒、写实程度；5. 叙事氛围：这组光影表达的人物关系、情绪张力、故事暗示和冲突方向；6. 电影机参数：机身、镜头、焦段、光圈、帧率、EI/ASA、快门角度、Log/记录格式；7. 负面约束：不要CGI感、不要渲染感、不要塑料皮肤、不要过度柔焦、不要低清晰度。",
      en: "When extracting lighting prompts from a film still, always output in this structure: 1. Lighting atmosphere: scene, time of day, key light source, light direction, softness/hardness, shadow shape, sky or ambient light; 2. Color logic: base palette, supporting colors, warm-cool relationship, saturation, color contrast; 3. Exposure and grading: color temperature, white balance, contrast, exposure, highlights, shadows, whites, blacks, saturation, clarity; 4. Scene atmosphere: spatial texture, composition, depth of field, resolution, film grain, realism; 5. Narrative mood: character relationship, emotional tension, story implication, conflict direction; 6. Camera parameters: camera body, lens, focal length, aperture, frame rate, EI/ASA, shutter angle, Log and recording format; 7. Negative constraints: no CGI look, no rendering look, no plastic skin, no excessive soft focus, no low resolution.",
      tags: ["电影静帧提取", "输出格式", "光影资产", "电影机参数"],
      scenarios: "从电影截图、参考图、剧照中提取光影氛围和相机参数",
      favorite: true,
      uses: 1,
      notes: "这是后续光影提示词的固定输出骨架。",
      updatedAt: "2026-06-20",
    },
  ],
  presets: [
    {
      id: "preset-lighting-still-extraction-v1",
      title: "电影静帧光影提取模板 v1",
      type: "光影提示词",
      zh: "请从我提供的电影静帧中提取可复用的光影提示词，并严格按照以下结构输出：\n\n【光影氛围】描述场景类型、时间、主光源、光线方向、光线硬软、阴影形态、天空/窗户/环境反射光、画面明暗关系。\n【色彩逻辑】提取主色基底、辅助色、冷暖关系、饱和度、色彩对比，以及这些颜色如何服务场景气质。\n【曝光与调色】提取色温、白平衡、对比度、曝光、高光、阴影、白色色阶、黑色色阶、饱和度、清晰度，并说明哪些是关键参数。\n【场景氛围】描述空间质感、构图方式、景深、清晰度、胶片颗粒、写实程度和整体电影质感。\n【叙事氛围】说明这组光影传达的人物关系、情绪张力、故事暗示、冲突方向和观众感受。\n【电影机参数】输出统一电影机参数：阿莱艾美拉摄影机，竖屏构图，24fps，EI/ASA 800，Log-C伽马，库克35mm定焦镜头S8/i系列，T1.4，快门角度180°，ProRes 4444 XQ / ARRIRAW；并根据画面估算白平衡、色温、曝光补偿和大光比。\n【全局质感】写实真人电影画质，raw photo, film grain, 8K, no CGI, no rendering, no smooth surface。\n【负面约束】不要CGI感，不要渲染感，不要塑料皮肤，不要过度柔焦，不要低清晰度，不要生硬阴影，不要廉价网感。",
      en: "Extract a reusable lighting prompt from the provided film still and output it in this structure: Lighting atmosphere, color logic, exposure and grading, scene atmosphere, narrative mood, camera parameters, global texture, and negative constraints. Use a realistic live-action cinematic baseline: ARRI Amira, vertical composition, 24fps, EI/ASA 800, Log-C, Cooke 35mm S8/i prime lens, T1.4, 180-degree shutter, ProRes 4444 XQ / ARRIRAW, film grain, 8K, no CGI, no rendering, no smooth surface.",
      negative: "不要CGI感，不要渲染感，不要塑料皮肤，不要过度柔焦，不要低清晰度，不要生硬阴影，不要廉价网感。",
      roleId: "",
      scene: "电影静帧 / 参考剧照光影提取",
      tags: ["电影静帧提取", "光影资产", "电影机参数", "ARRI", "Cooke"],
      model: "本地组合器",
      effect: "用于把电影静帧拆解成可复用光影资产，后续光影提示词按此结构输出。",
      versions: [
        {
          id: "version-lighting-still-extraction-v1",
          name: "v1",
          note: "固定为八段式光影资产输出结构。",
          zh: "电影静帧光影提取模板。",
          en: "Film still lighting extraction template.",
          negative: "无CGI感、无渲染感、无塑料质感。",
          createdAt: "2026-06-20",
        },
      ],
      createdAt: "2026-06-20",
      updatedAt: "2026-06-20",
    },
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
      usage: "不调用API，按照已选资产和存储词条自动组合提示词",
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
    {
      id: "model-deepseek-v4-flash",
      name: "DeepSeek V4 Flash",
      provider: "DeepSeek",
      modelId: "deepseek-v4-flash",
      endpoint: "云端网关",
      type: "文本",
      usage: "人物表演方案、提示词生成和结构化拆解",
      language: "中文",
      enabled: true,
      priority: 2,
      cloudManaged: true,
      notes: "API Key 由 Cloudflare Worker Secret 管理，不保存在浏览器。",
    },
    {
      id: "model-deepseek-v4-pro",
      name: "DeepSeek V4 Pro",
      provider: "DeepSeek",
      modelId: "deepseek-v4-pro",
      endpoint: "云端网关",
      type: "文本",
      usage: "复杂剧情推理和高精度人物表演方案",
      language: "中文",
      enabled: true,
      priority: 3,
      cloudManaged: true,
      notes: "可开启深度思考；API Key 由云端 Secret 管理。",
    },
  ],
};

let state = loadState();
let modalMode = null;
let modalEditingId = null;
let ingestionSelectedIds = new Set();
let ingestionBusy = false;
let ingestionPage = 1;

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
    if (state.activeView === "ingestion") document.getElementById("ingestionFileInput")?.click();
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
  const savedWorkbench = saved.workbench || {};
  const projects = mergeById(base.projects, saved.projects);
  const activeProjectId = projects.some((item) => item.id === saved.activeProjectId)
    ? saved.activeProjectId
    : base.activeProjectId;
  return {
    ...base,
    ...saved,
    activeProjectId,
    preferences: { ...base.preferences, ...(saved.preferences || {}) },
    workbench: {
      ...base.workbench,
      ...savedWorkbench,
      selectedModuleIds: { ...base.workbench.selectedModuleIds, ...(savedWorkbench.selectedModuleIds || {}) },
      moduleOverrides: { ...base.workbench.moduleOverrides, ...(savedWorkbench.moduleOverrides || {}) },
      results: { ...base.workbench.results, ...(savedWorkbench.results || {}) },
      negativeOptions: Array.isArray(savedWorkbench.negativeOptions) ? savedWorkbench.negativeOptions : base.workbench.negativeOptions,
      optimizationNotes: Array.isArray(savedWorkbench.optimizationNotes) ? savedWorkbench.optimizationNotes : base.workbench.optimizationNotes,
      lockedRecallIds: Array.isArray(savedWorkbench.lockedRecallIds) ? savedWorkbench.lockedRecallIds : base.workbench.lockedRecallIds,
      selectedKnowledgeEntryIds: Array.isArray(savedWorkbench.selectedKnowledgeEntryIds)
        ? savedWorkbench.selectedKnowledgeEntryIds
        : base.workbench.selectedKnowledgeEntryIds,
      performanceRecall: {
        ...base.workbench.performanceRecall,
        ...(savedWorkbench.performanceRecall || {}),
        lockedIds: Array.isArray(savedWorkbench.performanceRecall?.lockedIds)
          ? savedWorkbench.performanceRecall.lockedIds
          : base.workbench.performanceRecall.lockedIds,
        selectedIds: Array.isArray(savedWorkbench.performanceRecall?.selectedIds)
          ? savedWorkbench.performanceRecall.selectedIds
          : base.workbench.performanceRecall.selectedIds,
      },
      performancePlan: {
        ...base.workbench.performancePlan,
        ...(savedWorkbench.performancePlan || {}),
        plans: Array.isArray(savedWorkbench.performancePlan?.plans)
          ? savedWorkbench.performancePlan.plans
          : base.workbench.performancePlan.plans,
        customPrompts: {
          ...base.workbench.performancePlan.customPrompts,
          ...(savedWorkbench.performancePlan?.customPrompts || {}),
        },
      },
      aiBreakdown: {
        ...base.workbench.aiBreakdown,
        ...(savedWorkbench.aiBreakdown || {}),
        selectedOptionIds: { ...base.workbench.aiBreakdown.selectedOptionIds, ...(savedWorkbench.aiBreakdown?.selectedOptionIds || {}) },
        customValues: { ...base.workbench.aiBreakdown.customValues, ...(savedWorkbench.aiBreakdown?.customValues || {}) },
        cards: Array.isArray(savedWorkbench.aiBreakdown?.cards) ? savedWorkbench.aiBreakdown.cards : base.workbench.aiBreakdown.cards,
      },
      resultCards: {
        ...base.workbench.resultCards,
        ...(savedWorkbench.resultCards || {}),
        lockedIds: Array.isArray(savedWorkbench.resultCards?.lockedIds) ? savedWorkbench.resultCards.lockedIds : base.workbench.resultCards.lockedIds,
        cards: { ...base.workbench.resultCards.cards, ...(savedWorkbench.resultCards?.cards || {}) },
      },
    },
    roles: mergeById(base.roles, saved.roles),
    modules: mergeById(base.modules, saved.modules),
    presets: mergeById(base.presets, saved.presets),
    tags: unique([...(Array.isArray(saved.tags) ? saved.tags : []), ...base.tags]),
    models: mergeById(base.models, saved.models),
    projects,
    knowledge: KNOWLEDGE_CORE.migrateState(saved.knowledge || base.knowledge),
  };
}

function mergeById(defaultItems, savedItems) {
  if (!Array.isArray(savedItems)) return defaultItems;
  const savedIds = new Set(savedItems.map((item) => item.id));
  return [...savedItems, ...defaultItems.filter((item) => !savedIds.has(item.id))];
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

function getWorkbenchMode() {
  return WORKBENCH_MODES.find((mode) => mode.id === state.workbench.mode) || WORKBENCH_MODES[1];
}

function getWorkbenchTask() {
  return state.workbench.mode === "image" ? state.workbench.imageTask : state.workbench.videoTask;
}

function getActiveProject() {
  return state.projects.find((item) => item.id === state.activeProjectId) || state.projects[0] || null;
}

function applyProjectDefaults(project) {
  if (!project) return;
  if (project.defaultModel) state.workbench.targetTool = project.defaultModel;
  if (project.defaultAspectRatio) state.workbench.aspectRatio = project.defaultAspectRatio;
}

function applyRecalledModule(moduleId) {
  const module = getModule(moduleId);
  if (module) {
    state.workbench.selectedModuleIds[module.type] = module.id;
    delete state.workbench.moduleOverrides[module.type];
    module.uses = (Number(module.uses) || 0) + 1;
    module.updatedAt = today();
    return;
  }
  const knowledgeModule = getKnowledgeRecallModule(moduleId);
  if (!knowledgeModule) return;
  const selectedIds = new Set(state.workbench.selectedKnowledgeEntryIds || []);
  selectedIds.add(knowledgeModule.knowledgeEntryId);
  state.workbench.selectedKnowledgeEntryIds = [...selectedIds];
  const entry = getKnowledgeEntry(knowledgeModule.knowledgeEntryId);
  if (entry) {
    entry.uses = (Number(entry.uses) || 0) + 1;
    entry.updatedAt = new Date().toISOString();
  }
}

function toggleRecallLock(moduleId) {
  const ids = new Set(state.workbench.lockedRecallIds || []);
  if (ids.has(moduleId)) {
    ids.delete(moduleId);
    showToast("已取消锁定召回词条");
  } else {
    ids.add(moduleId);
    showToast("已锁定召回词条");
  }
  state.workbench.lockedRecallIds = [...ids].filter((id) => getRecallModule(id));
}

function syncPromptTypeWithMode() {
  const wb = state.workbench;
  if (wb.mode === "image") {
    wb.promptType = wb.imageTask || IMAGE_TASKS[0];
    wb.outputFormat = wb.outputFormat === "视频画面提示词" || wb.outputFormat === "分镜提示词" ? "中文提示词" : wb.outputFormat;
    wb.targetTool = ["可灵", "RunningHub"].includes(wb.targetTool) ? "Image2" : wb.targetTool;
  } else {
    wb.promptType = wb.videoTask || VIDEO_TASKS[0];
    wb.outputFormat = wb.outputFormat === "单张图提示词" ? "视频画面提示词" : wb.outputFormat;
    wb.targetTool = ["Midjourney", "Stable Diffusion"].includes(wb.targetTool) ? "可灵" : wb.targetTool;
  }
  regenerateResults();
}

function renderNav() {
  dom.nav.innerHTML = NAV_ITEMS.map((item) => {
    const isActive = item.id === state.activeView;
    const subnav = item.id === "workbench"
      ? `<div class="nav-sublist">
          ${WORKBENCH_MODES.map((mode) => `
            <button class="nav-subitem ${state.workbench.mode === mode.id ? "is-active" : ""}" type="button" data-workbench-mode-nav="${mode.id}">
              <i data-lucide="${mode.icon}"></i>
              <span>${mode.label}</span>
            </button>
          `).join("")}
        </div>`
      : "";
    return `
      <div class="nav-group">
        <a class="nav-item ${isActive ? "is-active" : ""}" href="#${item.id}">
          <i data-lucide="${item.icon}"></i>
          <span>${item.label}</span>
        </a>
        ${subnav}
      </div>
    `;
  }).join("");
  dom.nav.querySelectorAll("[data-workbench-mode-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      state.workbench.mode = button.dataset.workbenchModeNav;
      syncPromptTypeWithMode();
      saveState();
      location.hash = "#workbench";
      render();
    });
  });
  refreshIcons();
}

function render() {
  const item = NAV_ITEMS.find((entry) => entry.id === state.activeView) || NAV_ITEMS[0];
  const mode = getWorkbenchMode();
  document.body.classList.toggle("simple-workbench-mode", state.activeView === "workbench");
  dom.pageTitle.textContent = state.activeView === "workbench" ? mode.title : item.title;
  renderNav();

  if (state.activeView === "workbench") renderWorkbench();
  if (state.activeView === "roles") renderRoles();
  if (state.activeView === "modules") renderModules();
  if (state.activeView === "ingestion") renderIngestion();
  if (state.activeView === "presets") renderPresets();
  if (state.activeView === "tags") renderTags();
  if (state.activeView === "models") renderModels();

  refreshIcons();
}

function renderWorkbench() {
  ensureWorkbenchResults();
  const wb = state.workbench;
  const role = getRole(wb.roleId);
  const project = getActiveProject();

  dom.view.innerHTML = `
    <div class="simple-generator-page">
      ${renderSimpleGeneratorHeader()}
      <section class="simple-generator">
        <h2>AI短视频提示词生成器</h2>
        <textarea id="wbSourceBrief" class="simple-main-input" data-workbench-field="sourceBrief" placeholder="输入你的主要想法、剧情片段或画面需求...">${escapeHtml(wb.sourceBrief || "")}</textarea>
        <div class="simple-action-row">
          <button class="pf-button pf-primary" type="button" id="copyResultBtn">
            <i data-lucide="copy"></i>
            复制提示词
          </button>
          <button class="pf-button pf-secondary" type="button" id="topAiBreakdownBtn">
            <i data-lucide="sparkles"></i>
            AI拆解画面
          </button>
          <button class="pf-button pf-secondary" type="button" id="savePresetBtn">
            <i data-lucide="save"></i>
            保存到提示词库
          </button>
          <button class="pf-button pf-accent" type="button" id="topOptimizeBtn">
            <i data-lucide="wand-sparkles"></i>
            优化提示词
          </button>
        </div>
        ${renderModularResultEditor()}
        ${renderSmartRecallPanel(getSmartRecallEntries())}
        ${renderPerformanceRecallPanel()}
        ${renderPerformancePlannerPanel()}
        ${renderAiBreakdownPanel()}
        <section class="simple-params-card">
          ${renderProjectStyleBar(project)}
          ${renderSimpleParameterGrid(role)}
          ${renderSimpleCategoryTabs()}
          ${renderSimpleCategoryPanel()}
          <label class="pf-button pf-secondary upload-button" for="wbReferenceImage">
            <i data-lucide="upload"></i>
            上传参考图片
          </label>
          <input id="wbReferenceImage" type="file" accept="image/*" hidden />
          <div class="simple-file-note">${wb.referenceImageName ? `已选择参考图：${escapeHtml(wb.referenceImageName)}` : "可选：上传电影静帧或场景图，辅助判断光影、构图和相机参数。"}</div>
          <button class="pf-button pf-primary clear-button" type="button" id="clearWorkbenchBtn">
            清空全部
          </button>
        </section>
      </section>
    </div>
  `;

  bindWorkbenchEvents();
}

function renderSimpleGeneratorHeader() {
  return `
    <header class="simple-generator-header">
      <a class="simple-logo" href="#workbench" aria-label="返回工作台">
        <span class="simple-logo-mark">AP</span>
        <strong>提示词<span>控制台</span></strong>
      </a>
      <nav>
        <a href="#roles">角色资产</a>
        <a href="#modules">存储库</a>
        <a href="#presets">提示词库</a>
      </nav>
      <div class="simple-header-actions">
        <button class="pf-outline" type="button" id="simpleThemeBtn">
          <i data-lucide="${state.theme === "dark" ? "sun" : "moon"}"></i>
          ${state.theme === "dark" ? "白天模式" : "黑夜模式"}
        </button>
        <button class="pf-outline" type="button" id="simpleExportBtn">导出</button>
        <button class="pf-button pf-primary" type="button" id="generatePromptBtn">生成提示词</button>
      </div>
    </header>
  `;
}

function renderSimpleParameterGrid(role) {
  const wb = state.workbench;
  const tools = unique(["通用", ...TARGET_TOOLS, "自定义"]);
  return `
    <div class="simple-param-grid">
      ${renderSimpleSelect("提示词类型", "wbPromptType", PROMPT_TYPES, wb.promptType)}
      ${renderSimpleSelect("角色资产", "wbRole", ["::不使用角色", ...state.roles.map((item) => `${item.id}::${item.name} / ${item.identity}`)], role ? `${role.id}::${role.name} / ${role.identity}` : "", true)}
      ${renderSimpleSelect("模型", "wbTargetTool", tools, wb.targetTool)}
      ${renderSimpleSelect("比例", "wbAspectRatio", PARAMETER_GROUPS[0].options, wb.aspectRatio)}
      ${renderSimpleSelect("质量", "wbQuality", PARAMETER_GROUPS[1].options, wb.quality)}
      ${renderSimpleSelect("输出", "wbOutputFormat", OUTPUT_FORMATS, wb.outputFormat)}
      ${renderSimpleInput("动作幅度", "wbMotionLevel", wb.motionLevel || "", "静态 / 轻微 / 中等 / 明显")}
      ${renderSimpleInput("镜头控制", "wbCameraSpeed", wb.cameraSpeed || "", "慢 / 中 / 快")}
      ${renderSimpleInput("情绪", "wbEmotionIntensity", wb.emotionIntensity || "", "克制 / 中等 / 强烈")}
      ${renderSimpleInput("光影", "wbSceneGoal", wb.sceneGoal || "", "例如：夜色窗边强忍愤怒")}
      ${renderSimpleInput("动作细节", "wbActionDetail", wb.actionDetail || "", "补充动作细节")}
      ${renderSimpleInput("负面提示词", "wbCustomNegative", wb.customNegative || "", "避免出现的画面问题或跑偏内容")}
    </div>
  `;
}

function renderProjectStyleBar(project) {
  const current = project || state.projects[0];
  return `
    <section class="project-style-bar" aria-label="当前项目风格母版">
      <div class="project-style-main">
        <label class="simple-control project-select-control" for="wbProject">
          <span><i data-lucide="folder-kanban"></i>当前项目</span>
          <select id="wbProject">
            ${state.projects.map((item) => `<option value="${item.id}" ${item.id === current?.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
        </label>
        <div class="project-style-summary">
          <strong>${escapeHtml(current?.name || "未选择项目")}</strong>
          <span>${escapeHtml(current?.visualTone || "暂无画面基调")}</span>
          <small>${escapeHtml([current?.colorLogic, current?.lightingPreference].filter(Boolean).join(" / "))}</small>
        </div>
      </div>
      <div class="project-style-actions">
        <button class="pf-outline compact-project-button" type="button" id="newProjectBtn">
          <i data-lucide="plus"></i>新建母版
        </button>
        <button class="pf-outline compact-project-button" type="button" id="editProjectBtn" ${current ? "" : "disabled"}>
          <i data-lucide="pencil"></i>编辑
        </button>
        <button class="pf-outline compact-project-button danger-lite" type="button" id="deleteProjectBtn" ${state.projects.length > 1 && current ? "" : "disabled"}>
          <i data-lucide="trash-2"></i>删除
        </button>
      </div>
    </section>
  `;
}

function renderSmartRecallPanel(entries) {
  const lockedCount = state.workbench.lockedRecallIds?.length || 0;
  return `
    <section class="smart-recall-panel" aria-label="本次参考的存储词条">
      <div class="smart-recall-head">
        <div>
          <p class="eyebrow">智能召回</p>
          <h3>本次参考的存储词条</h3>
        </div>
        <span>${entries.length} 条匹配 / ${lockedCount} 条锁定</span>
      </div>
      ${entries.length ? `
        <div class="smart-recall-grid">
          ${entries.map(renderSmartRecallCard).join("")}
        </div>
      ` : `
        <p class="smart-recall-empty">输入剧情、场景、角色、情绪或光影关键词后，系统会从存储库自动召回可参考词条。</p>
      `}
    </section>
  `;
}

function renderSmartRecallCard(entry) {
  const typeLabel = getModuleTypeLabel(entry.module.type);
  const locked = state.workbench.lockedRecallIds?.includes(entry.module.id);
  const selected = isRecallModuleSelected(entry.module);
  return `
    <article class="smart-recall-card ${locked ? "is-locked" : ""}">
      <div class="smart-recall-card-head">
        <span>${escapeHtml(typeLabel)}</span>
        <strong>${escapeHtml(entry.module.name)}</strong>
      </div>
      <p>${escapeHtml(entry.reasons.join("；") || "与当前输入语义相近")}</p>
      <div class="smart-recall-actions">
        <button class="ghost-button compact" type="button" data-apply-recall="${escapeHtml(entry.module.id)}" ${selected ? "disabled" : ""}>
          <i data-lucide="${selected ? "check" : "plus"}"></i>${selected ? "已加入" : "加入当前提示词"}
        </button>
        <button class="ghost-button compact" type="button" data-toggle-recall-lock="${escapeHtml(entry.module.id)}">
          <i data-lucide="${locked ? "lock" : "unlock"}"></i>${locked ? "已锁定" : "锁定"}
        </button>
      </div>
    </article>
  `;
}

function renderPerformanceRecallPanel() {
  const recall = getPerformanceRecallEntries(5);
  const recallState = getPerformanceRecallState();
  const stats = PERFORMANCE_DATA.stats || {};
  return `
    <section class="performance-recall-panel" aria-label="人物表演案例召回">
      <div class="performance-recall-head">
        <div>
          <p class="eyebrow">表演案例召回</p>
          <h3>人物微表情参考</h3>
          <span>${stats.publishedCount || 0} 条内置案例 / ${getPublishedUserPerformanceExamples().length} 条用户案例</span>
        </div>
        <label class="performance-duration-field" for="performanceDurationInput">
          <span>镜头时长</span>
          <input id="performanceDurationInput" type="number" min="0.5" max="10" step="0.5" value="${Number(state.workbench.performanceDuration) || 2.5}" />
          <b>秒</b>
        </label>
      </div>
      <div class="performance-context-line">
        <span>刺激：${escapeHtml(recall.context.triggerType)}</span>
        <span>真实情绪：${escapeHtml(recall.context.primaryEmotion)}</span>
        <span>面具：${escapeHtml(recall.context.maskEmotion)}</span>
        <span>阶段：${escapeHtml(recall.context.performancePhase)}</span>
        <span>${recallState.selectedIds.length} 条已选 / ${recallState.lockedIds.length} 条锁定</span>
      </div>
      ${recall.results.length
        ? `<div class="performance-recall-grid">${recall.results.map(renderPerformanceRecallCard).join("")}</div>`
        : `<p class="smart-recall-empty">当前输入没有匹配到已发布的表演案例。</p>`}
    </section>
  `;
}

function renderPerformanceRecallCard(result) {
  const example = result.example;
  const recallState = getPerformanceRecallState();
  const selected = recallState.selectedIds.includes(example.id);
  const locked = recallState.lockedIds.includes(example.id);
  return `
    <article class="performance-recall-card ${selected ? "is-selected" : ""} ${locked ? "is-locked" : ""}">
      <div class="performance-card-head">
        <span>${escapeHtml(example.primaryEmotion)}</span>
        <strong>${escapeHtml(example.transition || example.primaryEmotion)}</strong>
        <small>${escapeHtml(example.performancePhase || "转变")}</small>
      </div>
      <p>${escapeHtml(example.visibleAction || example.expressionDetail)}</p>
      <div class="performance-card-meta">
        <span>${escapeHtml(example.triggerType)}</span>
        <span>${escapeHtml(example.shotSize || "未标注")}</span>
        <span>${Number(example.durationSeconds) || "-"}s</span>
        <span>质量 ${Math.round((Number(example.qualityScore) || 0) * 100)}%</span>
      </div>
      <div class="performance-match-reasons">${result.reasons.map((reason) => `<span>${escapeHtml(reason)}</span>`).join("")}</div>
      <div class="performance-card-actions">
        <button class="ghost-button compact ${selected ? "is-active" : ""}" type="button" data-select-performance-example="${escapeHtml(example.id)}">
          <i data-lucide="${selected ? "check" : "plus"}"></i>${selected ? "已加入参考" : "加入参考"}
        </button>
        <button class="ghost-button compact" type="button" data-lock-performance-example="${escapeHtml(example.id)}">
          <i data-lucide="${locked ? "lock" : "unlock"}"></i>${locked ? "已锁定" : "锁定"}
        </button>
      </div>
    </article>
  `;
}

function renderPerformancePlannerPanel() {
  const plannerState = getPerformancePlanState();
  const selectedPlan = getSelectedPerformancePlan();
  const hasPlans = plannerState.plans.length > 0;
  const inputChanged = hasPlans && plannerState.sourceSignature !== getCurrentPerformancePlannerSignature();
  return `
    <section class="performance-planner-panel" aria-label="人物表演方案生成器">
      <div class="performance-planner-head">
        <div>
          <p class="eyebrow">第五阶段 · 表演导演</p>
          <h3>人物表演方案</h3>
          <span>把剧情判断与召回案例合成为分秒可执行的表情、呼吸和身体动作。</span>
        </div>
        <div class="performance-planner-controls">
          <label for="performanceTextModelSelect">
            <span>文本模型</span>
            <select id="performanceTextModelSelect">
              ${TEXT_MODEL_OPTIONS.map((model) => `<option value="${model.id}" ${state.workbench.textModelId === model.id ? "selected" : ""} ${model.available ? "" : "disabled"}>${escapeHtml(model.label)}</option>`).join("")}
            </select>
          </label>
          <label for="performanceThinkingSelect">
            <span>推理模式</span>
            <select id="performanceThinkingSelect" ${state.workbench.textModelId === "local" ? "disabled" : ""}>
              <option value="false" ${state.workbench.textModelThinking ? "" : "selected"}>标准</option>
              <option value="true" ${state.workbench.textModelThinking ? "selected" : ""}>深度思考</option>
            </select>
          </label>
          <button class="pf-button pf-primary" type="button" id="performancePlanGenerateBtn">
            <i data-lucide="clapperboard"></i>
            ${hasPlans ? "重新生成方案" : "生成表演方案"}
          </button>
        </div>
      </div>
      ${hasPlans ? `
        <div class="performance-plan-meta">
          <span>${escapeHtml(plannerState.generatorLabel || "本地专业引擎")}</span>
          <span>${plannerState.plans.length} 套方案</span>
          ${plannerState.lockedPlanId ? "<span>1 套已锁定</span>" : ""}
          ${plannerState.usage?.total_tokens ? `<span>${Number(plannerState.usage.total_tokens)} tokens</span>` : ""}
          ${plannerState.fallbackReason ? `<span class="is-warning">云端失败，已回退本地：${escapeHtml(plannerState.fallbackReason)}</span>` : ""}
          <span class="performance-plan-stale is-warning" ${inputChanged ? "" : "hidden"}>输入已变化，建议重新生成</span>
        </div>
        <div class="performance-plan-grid">
          ${plannerState.plans.map(renderPerformancePlanCard).join("")}
        </div>
        ${selectedPlan ? renderPerformancePlanEditor(selectedPlan) : ""}
      ` : `
        <div class="performance-plan-empty">
          <strong>先确认剧情与镜头时长，再生成三种导演策略</strong>
          <span>系统会参考当前项目、角色资产和上方召回案例，生成克制留白、递进泄露与临界释放方案。</span>
        </div>
      `}
    </section>
  `;
}

function renderPerformancePlanCard(plan) {
  const plannerState = getPerformancePlanState();
  const selected = plannerState.selectedPlanId === plan.id;
  const locked = plannerState.lockedPlanId === plan.id;
  return `
    <article class="performance-plan-card ${selected ? "is-selected" : ""} ${locked ? "is-locked" : ""}">
      <div class="performance-plan-card-head">
        <div>
          <span>${escapeHtml(plan.intensity)}</span>
          <strong>${escapeHtml(plan.title)}</strong>
        </div>
        <b>${Math.round(Number(plan.fitScore) || 0)}%</b>
      </div>
      <p>${escapeHtml(plan.summary)}</p>
      <div class="performance-plan-analysis">
        <span>${escapeHtml(plan.analysis?.primaryEmotion || "复杂情绪")}</span>
        <span>${escapeHtml(plan.analysis?.maskEmotion || "无明确面具")}</span>
        <span>${escapeHtml(plan.analysis?.performancePhase || "转变")}</span>
        <span>${escapeHtml(plan.shotSize || "未标注")} / ${Number(plan.durationSeconds) || "-"}s</span>
      </div>
      <div class="performance-plan-timeline">
        ${(plan.beats || []).map((beat) => `
          <div>
            <time>${escapeHtml(beat.label)}</time>
            <span><b>${escapeHtml(beat.phase)}</b>${escapeHtml(beat.action)}</span>
          </div>
        `).join("")}
      </div>
      <div class="performance-plan-card-actions">
        <button class="ghost-button compact ${selected ? "is-active" : ""}" type="button" data-select-performance-plan="${escapeHtml(plan.id)}">
          <i data-lucide="${selected ? "check" : "plus"}"></i>${selected ? "已采用" : "采用方案"}
        </button>
        <button class="ghost-button compact" type="button" data-lock-performance-plan="${escapeHtml(plan.id)}">
          <i data-lucide="${locked ? "lock" : "unlock"}"></i>${locked ? "已锁定" : "锁定"}
        </button>
      </div>
    </article>
  `;
}

function renderPerformancePlanEditor(plan) {
  const prompt = getPerformancePlanPrompt(plan.id);
  return `
    <div class="performance-plan-editor">
      <div class="performance-plan-editor-head">
        <div>
          <span>当前采用方案</span>
          <strong>${escapeHtml(plan.title)}</strong>
        </div>
        <div class="performance-plan-editor-actions">
          <button class="ghost-button compact" type="button" data-copy-performance-plan="${escapeHtml(plan.id)}">
            <i data-lucide="copy"></i>复制
          </button>
          <button class="ghost-button compact" type="button" data-save-performance-plan="${escapeHtml(plan.id)}">
            <i data-lucide="database"></i>保存词条
          </button>
        </div>
      </div>
      <textarea data-performance-plan-edit="${escapeHtml(plan.id)}" rows="14">${escapeHtml(prompt)}</textarea>
    </div>
  `;
}

function renderAiBreakdownPanel() {
  const breakdown = getAiBreakdownState();
  const hasCards = breakdown.cards.length > 0;
  return `
    <section class="ai-breakdown-panel" aria-label="AI画面拆解">
      <div class="ai-breakdown-head">
        <div>
          <p class="eyebrow">画面拆解</p>
          <h3>AI画面拆解</h3>
          <span>基于当前项目风格母版、角色资产与本次召回词条生成候选方案。</span>
        </div>
        <button class="pf-button pf-primary" type="button" id="aiBreakdownBtn">
          <i data-lucide="wand-sparkles"></i>
          AI拆解画面
        </button>
      </div>
      ${hasCards ? `
        <div class="ai-breakdown-meta">
          <span>本地模拟生成</span>
          <span>${escapeHtml(breakdown.source || state.workbench.sourceBrief || "当前画面")}</span>
        </div>
        <div class="ai-breakdown-grid">
          ${breakdown.cards.map(renderAiBreakdownCard).join("")}
        </div>
      ` : `
        <p class="ai-breakdown-empty">输入剧情或画面描述后，点击“AI拆解画面”，系统会先给出场景、光影、动作、微表情、镜头等结构化候选卡片。</p>
      `}
    </section>
  `;
}

function renderAiBreakdownCard(card) {
  const breakdown = getAiBreakdownState();
  const section = AI_BREAKDOWN_SECTIONS.find((item) => item.id === card.id) || card;
  const selectedId = breakdown.selectedOptionIds[card.id] || card.options?.[0]?.id || "";
  const selectedOption = card.options?.find((item) => item.id === selectedId) || card.options?.[0];
  const currentValue = breakdown.customValues[card.id] ?? selectedOption?.text ?? "";
  return `
    <article class="ai-breakdown-card">
      <div class="ai-breakdown-card-head">
        <span><i data-lucide="${section.icon || "sparkles"}"></i>${escapeHtml(section.label || card.label)}</span>
      </div>
      <div class="ai-breakdown-options">
        ${(card.options || []).map((option) => `
          <button class="breakdown-option ${option.id === selectedId ? "is-selected" : ""}" type="button" data-breakdown-option="${escapeHtml(card.id)}::${escapeHtml(option.id)}">
            <strong>${escapeHtml(option.title)}</strong>
            <small>${escapeHtml(option.reason)}</small>
          </button>
        `).join("")}
      </div>
      <textarea class="breakdown-edit" data-breakdown-edit="${escapeHtml(card.id)}" rows="4">${escapeHtml(currentValue)}</textarea>
    </article>
  `;
}

function renderModularResultEditor() {
  const wb = state.workbench;
  const cards = getOrderedResultCards();
  const result = wb.results?.[state.resultTab] || "";
  return `
    <section class="modular-result-editor" aria-label="模块化结果编辑器">
      <div class="modular-result-head">
        <div>
          <p class="eyebrow">生成结果</p>
          <h3>模块化结果编辑器</h3>
          <span>编辑、锁定或保存单张卡片；底部会自动组合成完整提示词。</span>
        </div>
        <span>${cards.length} 个模块 / ${getResultCardState().lockedIds.length} 个已锁定</span>
      </div>
      <div class="result-card-grid">
        ${cards.map(renderResultModuleCard).join("")}
      </div>
      <div class="complete-prompt-panel">
        <div class="complete-prompt-head">
          <div>
            <p class="eyebrow">完整提示词</p>
            <h3>卡片组合结果</h3>
          </div>
          <div class="result-tabs">
            ${[
              ["zh", "中文"],
              ["en", "英文"],
              ["negative", "负面"],
              ["json", "JSON"],
            ].map(([id, label]) => `<button class="result-tab ${state.resultTab === id ? "is-active" : ""}" type="button" data-result-tab="${id}">${label}</button>`).join("")}
          </div>
        </div>
        <textarea id="resultText" class="complete-prompt-text" placeholder="完整提示词会由上方卡片自动组合。">${escapeHtml(result)}</textarea>
      </div>
    </section>
  `;
}

function renderResultModuleCard(card) {
  const cardType = RESULT_CARD_TYPES.find((item) => item.id === card.id) || card;
  const locked = getResultCardState().lockedIds.includes(card.id);
  return `
    <article class="result-module-card ${locked ? "is-locked" : ""}">
      <div class="result-module-card-head">
        <span><i data-lucide="${cardType.icon || "square"}"></i>${escapeHtml(cardType.label || card.label)}</span>
        <button class="icon-button result-lock-button" type="button" data-result-card-lock="${escapeHtml(card.id)}" aria-label="${locked ? "取消锁定" : "锁定"}">
          <i data-lucide="${locked ? "lock" : "unlock"}"></i>
        </button>
      </div>
      <textarea class="result-card-edit" data-result-card-edit="${escapeHtml(card.id)}" rows="5">${escapeHtml(card.zh || "")}</textarea>
      <div class="result-module-actions">
        <button class="ghost-button compact" type="button" data-result-card-copy="${escapeHtml(card.id)}">
          <i data-lucide="copy"></i>复制
        </button>
        <button class="ghost-button compact" type="button" data-result-card-save="${escapeHtml(card.id)}">
          <i data-lucide="database"></i>保存词条
        </button>
      </div>
    </article>
  `;
}

function renderSimpleSelect(label, id, options, value, encoded = false) {
  return `
    <label class="simple-control" for="${id}">
      <span><i data-lucide="info"></i>${escapeHtml(label)}</span>
      <select id="${id}">
        ${options.map((item) => {
          const optionValue = encoded && String(item).includes("::") ? String(item).split("::")[0] : item;
          const optionLabel = encoded && String(item).includes("::") ? String(item).split("::")[1] : item;
          const selected = encoded ? String(value).startsWith(`${optionValue}::`) || value === optionValue : item === value;
          return `<option value="${escapeHtml(optionValue)}" ${selected ? "selected" : ""}>${escapeHtml(optionLabel)}</option>`;
        }).join("")}
      </select>
    </label>
  `;
}

function renderSimpleInput(label, id, value, placeholder) {
  return `
    <label class="simple-control" for="${id}">
      <span><i data-lucide="info"></i>${escapeHtml(label)}</span>
      <input id="${id}" type="text" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />
    </label>
  `;
}

function renderSimpleCategoryTabs() {
  const active = state.workbench.activeCategory || "lighting";
  return `
    <div class="simple-category-tabs">
      ${GENERATOR_CATEGORIES.map((item) => `
        <button class="simple-category ${active === item.id ? "is-active" : ""}" type="button" data-generator-category="${item.id}">
          <i data-lucide="${item.icon}"></i>
          ${escapeHtml(item.label)}
        </button>
      `).join("")}
    </div>
  `;
}

function renderSimpleCategoryPanel() {
  const wb = state.workbench;
  const category = GENERATOR_CATEGORIES.find((item) => item.id === (wb.activeCategory || "lighting")) || GENERATOR_CATEGORIES[1];
  if (category.id === "negative") {
    return `
      <div class="simple-category-panel">
        <div class="negative-grid simple-negative-grid">
          ${NEGATIVE_OPTIONS.map((item) => `
            <label class="check-chip">
              <input type="checkbox" value="${escapeHtml(item)}" data-negative-option ${wb.negativeOptions?.includes(item) ? "checked" : ""} />
              <span>${escapeHtml(item)}</span>
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }
  return `
    <div class="simple-category-panel">
      ${category.groups.map((group) => renderChoiceGroup(group.label, group.key, group.options)).join("")}
    </div>
  `;
}

function renderPromptResultHero() {
  const wb = state.workbench;
  const result = wb.results?.[state.resultTab] || "";
  return `
    <section class="prompt-result-hero" id="promptResultHero">
      <div class="result-hero-head">
        <div>
          <p class="eyebrow">当前提示词结果</p>
          <h2>${escapeHtml(wb.promptType || getWorkbenchTask())}</h2>
          <p>选择提示词类型并填写画面目标后，这里会生成可复制、可编辑、可保存的专业提示词。</p>
        </div>
        <div class="result-main-actions">
          <button class="primary-button" type="button" id="generatePromptBtn">
            <i data-lucide="sparkles"></i>
            生成提示词
          </button>
          <button class="secondary-button" type="button" id="copyResultBtn">
            <i data-lucide="copy"></i>
            复制
          </button>
          <button class="secondary-button" type="button" id="savePresetBtn">
            <i data-lucide="save"></i>
            保存到提示词库
          </button>
          <button class="ghost-button" type="button" id="topOptimizeBtn">
            <i data-lucide="wand-sparkles"></i>
            优化
          </button>
          <button class="ghost-button" type="button" id="clearWorkbenchBtn">
            <i data-lucide="eraser"></i>
            清空
          </button>
        </div>
      </div>
      <div class="result-box result-hero-box">
        <div class="result-tabs">
          ${[
            ["zh", "中文提示词"],
            ["en", "英文提示词"],
            ["negative", "负面提示词"],
            ["json", "结构化提示词"],
          ].map(([id, label]) => `<button class="result-tab ${state.resultTab === id ? "is-active" : ""}" type="button" data-result-tab="${id}">${label}</button>`).join("")}
        </div>
        <textarea class="result-text top-result-text" id="resultText" placeholder="选择提示词类型并填写画面目标后，这里会生成可复制的专业提示词。">${escapeHtml(result)}</textarea>
        <div class="result-meta-line">
          <span>${escapeHtml(getWorkbenchMode().label)} / ${escapeHtml(getWorkbenchTask())}</span>
          <span>${escapeHtml(wb.targetTool || "通用")} / ${escapeHtml(wb.aspectRatio || "9:16")} / ${escapeHtml(wb.quality || "高质量")}</span>
        </div>
      </div>
    </section>
  `;
}

function renderQuickStart() {
  const wb = state.workbench;
  return `
    <section class="quick-start-section">
      <div class="section-headline">
        <div>
          <p class="eyebrow">快速开始</p>
          <h2>你想生成哪一种 AI 短视频提示词？</h2>
        </div>
        <p>选择一个任务类型，系统会自动展开对应的镜头、动作、表情与光影控制项。</p>
      </div>
      <div class="quick-start-grid">
        ${QUICK_START_TASKS.map((item) => `
          <button class="quick-start-card ${wb.quickTask === item.label ? "is-selected" : ""}" type="button" data-quick-task="${escapeHtml(item.label)}" data-quick-prompt-type="${escapeHtml(item.type)}">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.description)}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderWorkbenchRoleCard(role) {
  const wb = state.workbench;
  if (!role) {
    return `
      <section class="role-callout">
        <p class="eyebrow">角色资产</p>
        <h3>未选择角色</h3>
        <p>可以临时描述角色，也可以创建角色资产后复用固定项、可变项和禁止项。</p>
        <div class="button-row">
          <button class="secondary-button compact" type="button" id="useTemporaryRoleBtn">临时输入角色</button>
          <button class="primary-button compact" type="button" data-create-role>创建角色</button>
        </div>
      </section>
    `;
  }
  return `
    <section class="role-callout">
      <p class="eyebrow">当前角色资产</p>
      <h3>${escapeHtml(role.name)} / ${escapeHtml(role.identity)}</h3>
      <p>${escapeHtml(role.temperament)}</p>
      <div class="role-mini-list">
        <span><b>外观</b>${escapeHtml(compactText(role.fixed))}</span>
        <span><b>禁止</b>${escapeHtml(compactText(role.forbidden))}</span>
      </div>
      <div class="field">
        <label for="wbRole">更换角色</label>
        <select id="wbRole">
          <option value="">不使用角色</option>
          ${state.roles.map((item) => `<option value="${item.id}" ${item.id === wb.roleId ? "selected" : ""}>${escapeHtml(item.name)} / ${escapeHtml(item.identity)}</option>`).join("")}
        </select>
      </div>
      <div class="button-row">
        <button class="ghost-button compact" type="button" data-edit-role="${role.id}">
          <i data-lucide="pencil"></i>
          编辑
        </button>
        <button class="secondary-button compact" type="button" data-create-role>
          <i data-lucide="plus"></i>
          新建角色
        </button>
      </div>
    </section>
  `;
}

function renderChoiceGroup(label, key, options) {
  const value = state.workbench[key] || "";
  return `
    <div class="choice-group">
      <span>${escapeHtml(label)}</span>
      <div class="chip-row">
        ${options.map((option) => `
          <button class="chip ${value === option ? "is-selected" : ""}" type="button" data-choice-key="${key}" data-choice-value="${escapeHtml(option)}">
            ${escapeHtml(option)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderParameterGroup(group) {
  const value = state.workbench[group.key] || "";
  return `
    <div class="choice-group parameter-group">
      <span>${escapeHtml(group.label)}</span>
      <div class="segmented-row">
        ${group.options.map((option) => `
          <button class="segment-button ${value === option ? "is-selected" : ""}" type="button" data-choice-key="${group.key}" data-choice-value="${escapeHtml(option)}">
            ${escapeHtml(option)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderVersionPreview() {
  const recent = state.presets.slice(0, 3);
  if (!recent.length) return `<p class="empty-mini">保存结果后，这里会显示最近 3 条提示词版本。</p>`;
  return `
    <div class="mini-version-list">
      ${recent.map((preset) => `
        <div class="mini-version-row">
          <div>
            <strong>${escapeHtml(preset.title)}</strong>
            <span>${escapeHtml(preset.type)} / ${preset.versions?.length || 1} 版</span>
          </div>
          <div class="button-row">
            <button class="ghost-button compact" type="button" data-use-preset="${preset.id}">使用</button>
            <button class="ghost-button compact" type="button" data-copy-preset="${preset.id}">复制</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderTaskStrip() {
  const wb = state.workbench;
  const tasks = wb.mode === "image" ? IMAGE_TASKS : VIDEO_TASKS;
  const activeTask = getWorkbenchTask();
  return `
    <div class="field">
      <span class="label">${wb.mode === "image" ? "图片子任务" : "视频子任务"}</span>
      <div class="task-strip">
        ${tasks.map((task) => `
          <button class="task-chip ${task === activeTask ? "is-selected" : ""}" type="button" data-workbench-task="${escapeHtml(task)}">
            ${escapeHtml(task)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderInsightPackage(role) {
  const wb = state.workbench;
  const brief = wb.sourceBrief || wb.sceneGoal || "请先输入剧情、画面目标或镜头意图。";
  const task = getWorkbenchTask();
  const roleName = role?.name || "当前角色";
  const isVideo = wb.mode === "video";
  const cards = isVideo
    ? [
        {
          title: "AI剧情判断",
          tone: "判断",
          body: `当前输入的核心不是单纯执行「${brief}」，而是判断这一镜头最需要控制的情绪临界点、人物关系和画面节奏。${role ? `${roleName} 的固定气质是「${role.temperament}」，因此方案应优先保留角色克制感和一致性。` : "如果选择角色资产，系统会把角色固定项、可变项和禁止项一起纳入判断。"}`,
        },
        {
          title: "可拆解结构",
          tone: "拆解",
          body: "视频提示词会拆成场景空间、光影与相机参数、人物行为逻辑、动作节奏、微表情、镜头运动、画面质感和负面约束。每个结构项后续都应该给出多个可选方案，并允许用户锁定或改写。",
        },
        {
          title: "当前子任务重点",
          tone: "任务",
          body: getVideoTaskGuidance(task),
        },
        {
          title: "组合策略",
          tone: "输出",
          body: "最终结果不应只是拼接词条，而要把 AI 判断、参考图识别、角色资产和存储词条合成可直接投喂视频模型的完整提示词，并保留中文、英文、负面提示词和结构化 JSON。",
        },
      ]
    : [
        {
          title: "AI画面判断",
          tone: "判断",
          body: `当前输入会被理解为一张高质量静帧需求：先确定主体、构图、场景、光影、镜头焦段、画面质感和目标工具，再判断哪些元素必须固定，哪些可以变化。${role ? `${roleName} 的外观固定项会作为角色一致性锚点。` : ""}`,
        },
        {
          title: "可拆解结构",
          tone: "拆解",
          body: "图片提示词会拆成主体与角色、场景空间、构图景别、光影色调、相机参数、画面质感、风格参考和负面约束。后续可对每个结构项给出多个专业方案。",
        },
        {
          title: "当前子任务重点",
          tone: "任务",
          body: getImageTaskGuidance(task),
        },
        {
          title: "组合策略",
          tone: "输出",
          body: "最终结果应同时适合直接生成和继续精修：既有完整提示词，也保留可锁定的结构化词条，便于复用到角色定妆、场景概念和光影资产库。",
        },
      ];

  return `
    <section class="ai-insight-package">
      <div class="insight-head">
        <div>
          <p class="eyebrow">AI专业拆解方案包</p>
          <h3>${escapeHtml(task)}</h3>
        </div>
        <button class="secondary-button compact" type="button" id="applyInsightBtn">
          <i data-lucide="sparkles"></i>
          写入编辑区
        </button>
      </div>
      <div class="insight-grid">
        ${cards.map((card) => `
          <article class="insight-card">
            <span>${escapeHtml(card.tone)}</span>
            <h4>${escapeHtml(card.title)}</h4>
            <p>${escapeHtml(card.body)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function getVideoTaskGuidance(task) {
  const guidance = {
    "完整视频画面提示词": "需要同时输出场景、人物、动作、微表情、镜头、光影、质感、节奏和负面约束，适合直接投喂视频生成工具。",
    "场景光影与相机参数": "重点识别主光源、光线方向、色温、白平衡、曝光、对比度、阴影形态、镜头焦段、光圈、帧率和记录格式。",
    "人物动作设计": "重点把动作拆成起势、停顿、变化、收束，控制动作幅度、速度、身体重心和手部细节。",
    "人物行为逻辑": "重点判断人物为什么这么做、先做什么、后做什么、动作背后的心理动机和关系变化。",
    "微表情设计": "重点控制眼神、眉、嘴唇、呼吸、下颌、眼尾湿润度和表情强度，避免夸张表演。",
    "镜头运动": "重点给出镜头景别、运动方式、推拉摇移、速度、稳定性、焦点变化和情绪节奏。",
    "分镜 / 镜头序列": "重点拆成多个镜头，每个镜头给景别、动作、表情、光影、时长和转场逻辑。",
    "角色一致性约束": "重点锁定角色脸型、发型、服装主色、气质、表情范围和禁止变化项。",
    "负面提示词": "重点输出防跑偏约束，包括角色、风格、画质、动作、表情、镜头和模型常见错误。",
  };
  return guidance[task] || guidance["完整视频画面提示词"];
}

function getImageTaskGuidance(task) {
  const guidance = {
    "完整图片提示词": "需要完整覆盖主体、场景、构图、光影、色彩、相机参数、画面质感、风格和负面约束。",
    "角色定妆图": "重点锁定脸型、五官、发型、发色、肤色、服装、妆容、配饰和角色气质。",
    "场景概念图": "重点输出空间结构、时代背景、材质、道具、环境光、色彩基底和氛围关键词。",
    "光影氛围图": "重点提取主光源、光线方向、硬软程度、阴影形态、色温、白平衡、曝光和叙事氛围。",
    "相机参数复刻": "重点输出机身、镜头、焦段、光圈、ISO/EI、快门、Log、记录格式、景深和构图。",
    "封面海报图": "重点考虑主体识别度、视觉焦点、留白、标题空间、情绪冲击和商业短剧质感。",
  };
  return guidance[task] || guidance["完整图片提示词"];
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

  const projectSelect = document.getElementById("wbProject");
  if (projectSelect) {
    projectSelect.addEventListener("change", (event) => {
      state.activeProjectId = event.target.value;
      applyProjectDefaults(getActiveProject());
      regenerateResults();
      renderWorkbench();
      refreshIcons();
      showToast("已切换项目风格母版");
    });
  }

  const newProjectButton = document.getElementById("newProjectBtn");
  if (newProjectButton) newProjectButton.addEventListener("click", () => openProjectModal());

  const editProjectButton = document.getElementById("editProjectBtn");
  if (editProjectButton) editProjectButton.addEventListener("click", () => openProjectModal(getActiveProject()));

  const deleteProjectButton = document.getElementById("deleteProjectBtn");
  if (deleteProjectButton) deleteProjectButton.addEventListener("click", deleteActiveProject);

  document.querySelectorAll("[data-apply-recall]").forEach((button) => {
    button.addEventListener("click", () => {
      applyRecalledModule(button.dataset.applyRecall);
      regenerateResults();
      renderWorkbench();
      refreshIcons();
      showToast("已加入当前提示词");
    });
  });

  document.querySelectorAll("[data-toggle-recall-lock]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleRecallLock(button.dataset.toggleRecallLock);
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  });

  const performanceDurationInput = document.getElementById("performanceDurationInput");
  if (performanceDurationInput) {
    performanceDurationInput.addEventListener("change", () => {
      wb.performanceDuration = Math.max(0.5, Math.min(10, Number(performanceDurationInput.value) || 2.5));
      saveState();
      renderWorkbench();
    });
  }

  document.querySelectorAll("[data-select-performance-example]").forEach((button) => {
    button.addEventListener("click", () => {
      togglePerformanceExampleSelection(button.dataset.selectPerformanceExample);
      regenerateResults();
      saveState();
      renderWorkbench();
      showToast("表演案例参考已更新");
    });
  });

  document.querySelectorAll("[data-lock-performance-example]").forEach((button) => {
    button.addEventListener("click", () => {
      togglePerformanceExampleLock(button.dataset.lockPerformanceExample);
      saveState();
      renderWorkbench();
      showToast("表演案例锁定状态已更新");
    });
  });

  const performanceTextModelSelect = document.getElementById("performanceTextModelSelect");
  if (performanceTextModelSelect) {
    performanceTextModelSelect.addEventListener("change", (event) => {
      const model = getTextModelOption(event.target.value);
      if (!model?.available) return;
      wb.textModelId = model.id;
      if (model.id === "local") wb.textModelThinking = false;
      saveState();
      renderWorkbench();
      refreshIcons();
    });
  }

  const performanceThinkingSelect = document.getElementById("performanceThinkingSelect");
  if (performanceThinkingSelect) {
    performanceThinkingSelect.addEventListener("change", (event) => {
      wb.textModelThinking = event.target.value === "true";
      saveState();
    });
  }

  const performancePlanGenerateButton = document.getElementById("performancePlanGenerateBtn");
  if (performancePlanGenerateButton) {
    performancePlanGenerateButton.addEventListener("click", async () => {
      performancePlanGenerateButton.disabled = true;
      performancePlanGenerateButton.textContent = "正在生成";
      const generation = await generatePerformancePlans();
      regenerateResults();
      renderWorkbench();
      refreshIcons();
      showToast(generation.fallbackReason ? "云端调用失败，已使用本地引擎" : `${generation.generatorLabel} 已生成方案`);
    });
  }

  document.querySelectorAll("[data-select-performance-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      selectPerformancePlan(button.dataset.selectPerformancePlan);
      regenerateResults();
      renderWorkbench();
      refreshIcons();
      showToast("已采用人物表演方案");
    });
  });

  document.querySelectorAll("[data-lock-performance-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      togglePerformancePlanLock(button.dataset.lockPerformancePlan);
      regenerateResults();
      renderWorkbench();
      refreshIcons();
      showToast("表演方案锁定状态已更新");
    });
  });

  document.querySelectorAll("[data-performance-plan-edit]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      updatePerformancePlanPrompt(event.target.dataset.performancePlanEdit, event.target.value);
      regenerateResults();
      const expressionEditor = document.querySelector('[data-result-card-edit="microExpression"]');
      if (expressionEditor) expressionEditor.value = getResultCard("microExpression")?.zh || "";
    });
  });

  document.querySelectorAll("[data-copy-performance-plan]").forEach((button) => {
    button.addEventListener("click", () => copyText(getPerformancePlanPrompt(button.dataset.copyPerformancePlan)));
  });

  document.querySelectorAll("[data-save-performance-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      savePerformancePlanAsKnowledge(button.dataset.savePerformancePlan);
      renderWorkbench();
      refreshIcons();
    });
  });

  document.querySelectorAll("#aiBreakdownBtn, #topAiBreakdownBtn").forEach((aiBreakdownButton) => {
    aiBreakdownButton.addEventListener("click", async () => {
      await generateAiBreakdown();
      regenerateResults();
      renderWorkbench();
      refreshIcons();
      showToast("AI画面拆解已生成");
    });
  });

  document.querySelectorAll("[data-breakdown-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const [sectionId, optionId] = button.dataset.breakdownOption.split("::");
      selectAiBreakdownOption(sectionId, optionId);
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  });

  document.querySelectorAll("[data-breakdown-edit]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      updateAiBreakdownValue(event.target.dataset.breakdownEdit, event.target.value);
      regenerateResults();
    });
  });

  document.querySelectorAll("[data-result-card-edit]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      updateResultCardValue(event.target.dataset.resultCardEdit, event.target.value);
      regenerateResults({ preserveCards: true });
    });
  });

  document.querySelectorAll("[data-result-card-lock]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleResultCardLock(button.dataset.resultCardLock);
      regenerateResults({ preserveCards: true });
      renderWorkbench();
      refreshIcons();
    });
  });

  document.querySelectorAll("[data-result-card-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = getResultCard(button.dataset.resultCardCopy);
      copyText(card?.zh || "");
    });
  });

  document.querySelectorAll("[data-result-card-save]").forEach((button) => {
    button.addEventListener("click", () => {
      saveResultCardAsModule(button.dataset.resultCardSave);
    });
  });

  document.querySelectorAll("[data-workbench-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      wb.mode = button.dataset.workbenchMode;
      syncPromptTypeWithMode();
      render();
    });
  });

  document.querySelectorAll("[data-quick-task]").forEach((button) => {
    button.addEventListener("click", () => {
      wb.quickTask = button.dataset.quickTask;
      wb.promptType = button.dataset.quickPromptType;
      if (wb.promptType === "视频分镜提示词") {
        wb.mode = "video";
        wb.videoTask = "分镜 / 镜头序列";
      }
      if (wb.promptType === "光影提示词") {
        wb[wb.mode === "image" ? "imageTask" : "videoTask"] = wb.mode === "image" ? "光影氛围图" : "场景光影与相机参数";
      }
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  });

  document.querySelectorAll("[data-prompt-type]").forEach((button) => {
    button.addEventListener("click", () => {
      wb.promptType = button.dataset.promptType;
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  });

  const roleSelect = document.getElementById("wbRole");
  if (roleSelect) {
    roleSelect.addEventListener("change", (event) => {
      wb.roleId = event.target.value;
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  }

  const promptTypeSelect = document.getElementById("wbPromptType");
  if (promptTypeSelect) {
    promptTypeSelect.addEventListener("change", (event) => {
      wb.promptType = event.target.value;
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  }

  const outputFormatSelect = document.getElementById("wbOutputFormat");
  if (outputFormatSelect) outputFormatSelect.addEventListener("change", (event) => {
    wb.outputFormat = event.target.value;
    regenerateResults();
  });
  const targetToolSelect = document.getElementById("wbTargetTool");
  if (targetToolSelect) targetToolSelect.addEventListener("change", (event) => {
    wb.targetTool = event.target.value;
    regenerateResults();
  });

  const mappedControls = [
    ["wbAspectRatio", "aspectRatio"],
    ["wbQuality", "quality"],
    ["wbMotionLevel", "motionLevel"],
    ["wbCameraSpeed", "cameraSpeed"],
    ["wbEmotionIntensity", "emotionIntensity"],
    ["wbSceneGoal", "sceneGoal"],
    ["wbActionDetail", "actionDetail"],
    ["wbCustomNegative", "customNegative"],
  ];
  mappedControls.forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", (event) => {
      wb[key] = event.target.value;
      regenerateResults();
      refreshPerformancePlanStaleIndicator();
    });
    input.addEventListener("change", (event) => {
      wb[key] = event.target.value;
      regenerateResults();
      refreshPerformancePlanStaleIndicator();
    });
  });

  document.querySelectorAll("[data-workbench-field]").forEach((field) => {
    field.addEventListener("input", (event) => {
      wb[event.target.dataset.workbenchField] = event.target.value;
      regenerateResults();
      refreshPerformancePlanStaleIndicator();
    });
  });

  document.getElementById("wbReferenceImage").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    wb.referenceImageName = file ? file.name : "";
    saveState();
    renderWorkbench();
    refreshIcons();
  });

  document.querySelectorAll("[data-quick-scene]").forEach((button) => {
    button.addEventListener("click", () => {
      wb.goal = button.dataset.quickScene;
      if (!wb.sceneGoal || wb.sceneGoal === DEFAULT_STATE.workbench.sceneGoal) {
        wb.sceneGoal = button.dataset.quickScene;
      }
      if (!wb.sourceBrief) {
        wb.sourceBrief = `${button.dataset.quickScene}：`;
      }
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  });

  document.querySelectorAll("[data-choice-key]").forEach((button) => {
    button.addEventListener("click", () => {
      wb[button.dataset.choiceKey] = button.dataset.choiceValue;
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  });

  document.querySelectorAll("[data-generator-category]").forEach((button) => {
    button.addEventListener("click", () => {
      wb.activeCategory = button.dataset.generatorCategory;
      saveState();
      renderWorkbench();
      refreshIcons();
    });
  });

  document.querySelectorAll("[data-negative-option]").forEach((input) => {
    input.addEventListener("change", () => {
      const checked = [...document.querySelectorAll("[data-negative-option]:checked")].map((item) => item.value);
      wb.negativeOptions = checked;
      regenerateResults();
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

  document.getElementById("generatePromptBtn").addEventListener("click", () => {
    regenerateResults();
    renderWorkbench();
    flashResultHero();
    showToast("已生成提示词");
  });
  document.getElementById("copyResultBtn").addEventListener("click", () => copyText(wb.results[state.resultTab] || ""));
  document.getElementById("savePresetBtn").addEventListener("click", saveCurrentPreset);
  document.getElementById("topOptimizeBtn").addEventListener("click", () => {
    applyQuickOptimize("cinematic");
    renderWorkbench();
    showToast("已加入电影感优化方向");
  });
  document.getElementById("clearWorkbenchBtn").addEventListener("click", clearWorkbench);

  const applyInsightButton = document.getElementById("applyInsightBtn");
  if (applyInsightButton) {
    applyInsightButton.addEventListener("click", () => {
      applyInsightToEditor();
      regenerateResults();
      renderWorkbench();
      showToast("AI拆解方案已写入编辑区");
    });
  }

  const simpleExportButton = document.getElementById("simpleExportBtn");
  if (simpleExportButton) simpleExportButton.addEventListener("click", exportData);

  const simpleThemeButton = document.getElementById("simpleThemeBtn");
  if (simpleThemeButton) {
    simpleThemeButton.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      document.body.classList.toggle("dark", state.theme === "dark");
      saveState();
      renderWorkbench();
      refreshIcons();
    });
  }

  document.querySelectorAll("[data-optimization]").forEach((button) => {
    button.addEventListener("click", () => {
      applyQuickOptimize(button.dataset.optimization);
      renderWorkbench();
      showToast(`已加入「${button.textContent.trim()}」优化`);
    });
  });

  document.querySelectorAll("[data-create-role]").forEach((button) => button.addEventListener("click", () => openRoleModal()));
  document.querySelectorAll("[data-edit-role]").forEach((button) => button.addEventListener("click", () => openRoleModal(getRole(button.dataset.editRole))));
  document.querySelectorAll("[data-use-preset]").forEach((button) => button.addEventListener("click", () => usePreset(button.dataset.usePreset)));
  document.querySelectorAll("[data-copy-preset]").forEach((button) => button.addEventListener("click", () => {
    const preset = getPreset(button.dataset.copyPreset);
    copyText([preset.zh, preset.en, preset.negative].filter(Boolean).join("\n\n"));
  }));

  const temporaryRole = document.getElementById("useTemporaryRoleBtn");
  if (temporaryRole) {
    temporaryRole.addEventListener("click", () => {
      wb.roleId = "";
      wb.extra = [wb.extra, "临时角色描述：请在当前创作目标中补充角色外观、身份、气质与禁止项。"].filter(Boolean).join("\n");
      regenerateResults();
      renderWorkbench();
      showToast("已切换为临时角色描述");
    });
  }

  const resetButton = document.getElementById("resetWorkbenchBtn");
  if (resetButton) resetButton.addEventListener("click", () => {
    state.workbench = clone(DEFAULT_STATE.workbench);
    regenerateResults();
    saveState();
    renderWorkbench();
    showToast("工作台已恢复为示例配置");
  });
}

function applyQuickOptimize(id) {
  const wb = state.workbench;
  const action = OPTIMIZE_ACTIONS.find((item) => item.id === id);
  if (!action) return;
  wb.optimizationNotes = wb.optimizationNotes || [];
  const exists = wb.optimizationNotes.some((item) => item.id === id);
  if (!exists) wb.optimizationNotes.push(action);
  if (id === "english") wb.outputFormat = "英文提示词";
  if (id === "bilingual") wb.outputFormat = "中英双语";
  if (id === "kling") wb.targetTool = "可灵";
  if (id === "jimeng") wb.targetTool = "即梦";
  if (id === "midjourney") {
    wb.mode = "image";
    wb.targetTool = "Midjourney";
    wb.aspectRatio = wb.aspectRatio || "9:16";
  }
  regenerateResults();
}

function clearWorkbench() {
  const ok = confirm("确认清空当前工作台内容吗？角色资产和存储库不会被删除。");
  if (!ok) return;
  state.workbench = {
    ...clone(DEFAULT_STATE.workbench),
    roleId: state.workbench.roleId,
    selectedModuleIds: { ...state.workbench.selectedModuleIds },
  };
  regenerateResults();
  saveState();
  renderWorkbench();
  showToast("当前工作台已清空并保留资产选择");
}

function flashResultHero() {
  const hero = document.getElementById("promptResultHero");
  if (!hero) return;
  hero.classList.add("is-updated");
  hero.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => hero.classList.remove("is-updated"), 1000);
}

function applyInsightToEditor() {
  const wb = state.workbench;
  const task = getWorkbenchTask();
  const role = getRole(wb.roleId);
  const brief = wb.sourceBrief || wb.sceneGoal || "当前画面需求";
  wb.sceneGoal = `${task}：${brief}`;
  wb.frameDescription = wb.mode === "video"
    ? `请基于输入内容拆解视频画面：先判断场景空间和人物站位，再输出光影与相机参数、人物行为逻辑、动作节奏、微表情、镜头运动和负面约束。${role ? `角色资产优先保持 ${role.name} 的固定项与禁止项。` : ""}`
    : `请基于输入内容拆解图片画面：先判断主体、场景、构图和视觉焦点，再输出光影色调、相机参数、画面质感、风格参考和负面约束。${role ? `角色资产优先保持 ${role.name} 的外观一致性。` : ""}`;
  wb.extra = [
    wb.referenceImageName ? `参考图：${wb.referenceImageName}` : "暂无参考图；如上传图片，需要识别空间、光源、色彩、镜头和人物站位。",
    wb.referenceNote || "输出必须体现专业判断，不要只给简单标签；每个结构项后续都应支持多方案选择、锁定和修改。",
  ].join("\n");
}

function getAiBreakdownState() {
  const wb = state.workbench;
  if (!wb.aiBreakdown) wb.aiBreakdown = clone(DEFAULT_STATE.workbench.aiBreakdown);
  wb.aiBreakdown.selectedOptionIds = wb.aiBreakdown.selectedOptionIds || {};
  wb.aiBreakdown.customValues = wb.aiBreakdown.customValues || {};
  wb.aiBreakdown.cards = Array.isArray(wb.aiBreakdown.cards) ? wb.aiBreakdown.cards : [];
  return wb.aiBreakdown;
}

async function generateAiBreakdown() {
  const context = buildAiBreakdownContext();
  state.workbench.aiBreakdown = await requestAiBreakdownFromModel(context);
  applyAiBreakdownToWorkbench();
  saveState();
}

async function requestAiBreakdownFromModel(context) {
  // Future API seam: replace this local simulator with a real model request.
  return generateLocalAiBreakdown(context);
}

function buildAiBreakdownContext() {
  const wb = state.workbench;
  const role = getRole(wb.roleId);
  const project = getActiveProject();
  const recalledEntries = getSmartRecallEntries(8);
  return {
    brief: wb.sourceBrief || wb.sceneGoal || wb.frameDescription || "女主在夜色窗边压住愤怒，准备说出真相",
    frameDescription: wb.frameDescription,
    extra: wb.extra,
    project,
    role,
    recalledEntries,
    recalledModules: recalledEntries.map((entry) => entry.module),
  };
}

function generateLocalAiBreakdown(context) {
  const selectedOptionIds = {};
  const customValues = {};
  const cards = AI_BREAKDOWN_SECTIONS.map((section) => {
    const options = buildBreakdownOptions(section, context).slice(0, 3).map((option, index) => ({
      id: `${section.id}-${index + 1}`,
      title: option.title,
      text: option.text,
      reason: option.reason,
    }));
    selectedOptionIds[section.id] = options[0]?.id || "";
    customValues[section.id] = options[0]?.text || "";
    return { id: section.id, label: section.label, icon: section.icon, options };
  });
  return {
    generatedAt: new Date().toISOString(),
    source: context.brief,
    selectedOptionIds,
    customValues,
    cards,
  };
}

function buildBreakdownOptions(section, context) {
  const { brief, project, role, recalledModules } = context;
  const recallText = summarizeRecallModules(recalledModules);
  const roleName = role?.name || "当前角色";
  const projectTone = project?.visualTone || "高级短剧电影感";
  const projectColor = project?.colorLogic || "低饱和、冷暖克制对比";
  const projectLight = project?.lightingPreference || "窗边侧光、柔和暗部、保留真实阴影";
  const projectLens = project?.lensLanguage || "近景、过肩、轻微推进，强调情绪压迫";
  const projectTexture = project?.characterTexture || "真人皮肤质感、保留细节纹理";
  const projectGrain = project?.filmGrain || "细腻胶片颗粒";
  const defaultNegative = project?.defaultNegative || "避免夸张表情、塑料皮肤、脸部跑偏和过度柔焦";

  const options = {
    sceneSpace: [
      {
        title: "夜色窗边近景",
        text: `室内夜色窗边空间，${roleName}靠近玻璃站立，窗外城市冷光与雨夜反光虚化成背景，人物与窗框形成压迫性的边缘构图，画面基调保持${projectTone}，核心围绕“${brief}”。`,
        reason: "匹配剧情中的夜色、窗边与真相揭露",
      },
      {
        title: "窄空间对峙",
        text: "压缩的室内近景空间，人物被窗框、墙面或桌沿切割在画面一侧，背景只保留少量环境信息，让空间服务于克制、隐忍、即将摊牌的叙事张力。",
        reason: "强化人物被情绪挤压的空间感",
      },
      {
        title: "参考图优先空间",
        text: "若上传参考图，优先识别图中的空间结构、主光方向、窗户位置和人物可站立区域，再把剧情动作嵌入原有空间，不随意改变场景资产。",
        reason: "为后续接入视觉模型预留规则",
      },
    ],
    lightingMood: [
      {
        title: "冷暖窗边侧光",
        text: `${projectLight}。主光来自窗外蓝冷夜光，室内保留一层极弱暖光补面，人物半边脸被柔和侧逆光勾出轮廓，暗部不死黑，眼神里有压住愤怒的湿润高光。参考召回：${recallText}。`,
        reason: "结合项目母版光影和召回词条",
      },
      {
        title: "低照度压迫光",
        text: "整体低照度、高级灰暗调，窗外霓虹或月光在脸侧形成窄光带，背景轻微失焦，阴影面积大但保留皮肤和服装纹理，营造真相即将出口前的窒息感。",
        reason: "适合情绪克制与夜戏",
      },
      {
        title: "泪光控制光",
        text: "用极细的眼部 catch light 控制微表情，避免大面积亮脸；高光只落在眼尾、鼻梁边缘和唇线，既看见怒意，也不让表演变成哭戏。",
        reason: "服务微表情精度",
      },
    ],
    colorLogic: [
      {
        title: "冷蓝紫主调",
        text: `${projectColor}。画面以冷蓝、灰紫、黑白灰为主，室内少量暖金或肤色作为情绪反差，降低饱和度，避免艳丽霓虹抢走人物表演。`,
        reason: "贴合项目母版与高级灰紫调",
      },
      {
        title: "真相前冷暖对撞",
        text: "人物脸部用冷光压住情绪，背景保留极弱暖色生活痕迹，形成“外冷内热”的色彩逻辑，暗示她表面克制但内心即将爆发。",
        reason: "把叙事信息写进色彩",
      },
      {
        title: "低饱和电影调色",
        text: "降低整体饱和度与对比度，压高光、提少量暗部细节，肤色保持真实不过分美白，蓝紫阴影与暖色皮肤之间要有自然过渡。",
        reason: "保证真人质感和统一图片风格",
      },
    ],
    cameraParams: [
      {
        title: "电影近景参数",
        text: "ARRI Alexa / Amira 质感，Cooke 35mm 或 50mm 定焦，T1.4-T2.0，24fps，EI 800，180°快门，Log-C，竖屏 9:16，浅景深但五官清晰，ProRes 4444 XQ / ARRIRAW 质感。",
        reason: "延续平台已有电影机参数体系",
      },
      {
        title: "窗边夜戏白平衡",
        text: "白平衡 4300K-5200K，保留窗外冷色倾向，曝光略压 -0.3 到 0 档，高光不过曝，暗部保留服装和发丝层次。",
        reason: "适合冷调窗边夜景",
      },
      {
        title: "情绪特写参数",
        text: "50mm 人像近景或轻微长焦压缩，焦点锁定眼睛，背景散景柔和，运动幅度极小，避免广角畸变和AI面部变形。",
        reason: "保护微表情和脸部一致性",
      },
    ],
    blocking: [
      {
        title: "边缘站位",
        text: `${roleName}站在画面边侧靠近窗户，身体略微背向对话对象，脸转向镜头三分之二侧面，留出窗外冷色负空间，突出未说出口的真相。`,
        reason: "匹配窗边与克制情绪",
      },
      {
        title: "压迫居中",
        text: "人物居中但被窗框线条切割，肩颈收紧，下颌微收，画面四周留出黑暗空间，让观众感到她被环境与秘密包围。",
        reason: "更强烈的戏剧压迫",
      },
      {
        title: "对话前距离",
        text: "如果画面包含对手，二人保持一臂以上距离，女主更靠近窗边，对手处于前景虚化或画外，只用站位暗示冲突。",
        reason: "适合对话冲突前一秒",
      },
    ],
    action: [
      {
        title: "压住愤怒的小动作",
        text: `${roleName}指尖轻轻攥紧衣角或窗帘边缘，肩膀僵硬但动作幅度很小，开口前先短暂停顿，像是在把怒气压回喉咙。`,
        reason: "把“压住愤怒”转成可拍动作",
      },
      {
        title: "准备说出真相",
        text: "她先避开视线，随后缓慢抬眼看向对方，手指从攥紧到松开一半，呼吸变浅，嘴唇轻启但没有立刻说话。",
        reason: "适合真相揭露前的动作节奏",
      },
      {
        title: "克制爆发前",
        text: "身体不大幅移动，只让指节、下颌、肩颈和眼神完成情绪递进，动作延迟半拍，避免戏剧化甩头、拍桌或夸张哭喊。",
        reason: "符合高精度短剧表演控制",
      },
    ],
    microExpression: [
      {
        title: "愤怒但克制",
        text: "眼尾微红但不落泪，眉头向内压低，嘴唇紧抿后轻微分开，鼻翼极轻收缩，眼神短暂闪躲后重新稳定，怒意被压在冷静表面下。",
        reason: "参考愤怒类微表情词条",
      },
      {
        title: "真相出口前",
        text: "眼神先失焦一瞬，随后聚焦到对方身上；下颌微微绷紧，喉结或颈部吞咽感轻微出现，呼吸压低，语气还没出来但情绪已经到达临界点。",
        reason: "更强调叙事转折",
      },
      {
        title: "冷静掩饰裂缝",
        text: "表情整体冷静，只有眼尾湿润、眉峰轻抖、唇角下压这几个细节泄露真实情绪，不要大哭、不要怒吼、不要夸张皱脸。",
        reason: "控制人物高级感与一致性",
      },
    ],
    cameraMotion: [
      {
        title: "极慢推进",
        text: `${projectLens}。镜头从近景极慢推进到更紧的眼部近景，移动速度克制，推进只服务于真相即将说出口的心理压力。`,
        reason: "适合压迫情绪递进",
      },
      {
        title: "静止观察",
        text: "镜头基本静止，轻微手持呼吸感，保持观众像旁观者一样被迫看见她的克制，不使用明显摇晃或炫技运动。",
        reason: "更沉稳、更高级",
      },
      {
        title: "过肩压迫",
        text: "若有对手，使用轻微过肩前景遮挡，女主眼睛保持清晰焦点，镜头只做微小横移，让空间距离和视线压力参与叙事。",
        reason: "适合对话冲突场面",
      },
    ],
    texture: [
      {
        title: "真人电影皮肤",
        text: `${projectTexture}，保留皮肤真实纹理、发丝边缘和服装材质，${projectGrain}，画面不塑料、不磨皮，整体是写实真人电影剧照质感。`,
        reason: "来自项目人物质感与胶片颗粒",
      },
      {
        title: "低噪夜戏质感",
        text: "夜戏暗部有细腻颗粒和真实噪点，但不能脏乱；窗外散景柔和，室内边缘不过度锐化，保持高级短剧的自然真实感。",
        reason: "适合夜色窗边",
      },
      {
        title: "克制高光质感",
        text: "高光柔和但不糊，眼部与唇线保留精细反光，服装深色区域仍有层次，避免AI渲染感、过度平滑和玻璃皮肤。",
        reason: "保护最终画面可控性",
      },
    ],
    negative: [
      {
        title: "角色一致性约束",
        text: `${defaultNegative}。不要改变角色脸型、发色、年龄感和服装主色调；不要幼态化、欧美化、卡通化或过度美颜。`,
        reason: "来自项目默认负面提示词",
      },
      {
        title: "表演约束",
        text: "避免夸张大哭、怒吼、瞪眼、甩头、拍桌、表情崩坏；不要让“愤怒”变成粗暴肢体动作，要保持隐忍和克制。",
        reason: "匹配当前剧情表演需求",
      },
      {
        title: "画面约束",
        text: "避免低清晰度、塑料皮肤、五官漂移、手指错误、窗外背景抢戏、过曝霓虹、死黑暗部、过度柔焦和廉价网感滤镜。",
        reason: "保证电影级画面质量",
      },
    ],
  };

  return options[section.id] || [];
}

function summarizeRecallModules(modules) {
  const summary = (modules || [])
    .slice(0, 4)
    .map((module) => `${getModuleTypeLabel(module.type)} / ${module.name}`)
    .join("；");
  return summary || "暂无强召回词条";
}

function selectAiBreakdownOption(sectionId, optionId) {
  const breakdown = getAiBreakdownState();
  const card = breakdown.cards.find((item) => item.id === sectionId);
  const option = card?.options?.find((item) => item.id === optionId);
  if (!option) return;
  breakdown.selectedOptionIds[sectionId] = optionId;
  breakdown.customValues[sectionId] = option.text;
  applyAiBreakdownToWorkbench(sectionId);
}

function updateAiBreakdownValue(sectionId, value) {
  const breakdown = getAiBreakdownState();
  breakdown.customValues[sectionId] = value;
  applyAiBreakdownToWorkbench(sectionId);
}

function applyAiBreakdownToWorkbench(sectionId = "") {
  const wb = state.workbench;
  const sections = sectionId
    ? AI_BREAKDOWN_SECTIONS.filter((section) => section.id === sectionId)
    : AI_BREAKDOWN_SECTIONS;
  sections.forEach((section) => {
    if (!section.target) return;
    const value = getSelectedAiBreakdownValue(section.id);
    if (value) wb[section.target] = value;
  });
}

function getSelectedAiBreakdownValue(sectionId) {
  const breakdown = getAiBreakdownState();
  const card = breakdown.cards.find((item) => item.id === sectionId);
  const selectedId = breakdown.selectedOptionIds[sectionId] || card?.options?.[0]?.id;
  const selected = card?.options?.find((item) => item.id === selectedId) || card?.options?.[0];
  return breakdown.customValues[sectionId] ?? selected?.text ?? "";
}

function renderSelectedAiBreakdown(language = "zh") {
  const breakdown = getAiBreakdownState();
  if (!breakdown.cards.length) {
    return language === "zh" ? "未生成AI画面拆解。" : "No AI scene breakdown generated.";
  }
  return breakdown.cards.map((card) => {
    const section = AI_BREAKDOWN_SECTIONS.find((item) => item.id === card.id) || card;
    const value = getSelectedAiBreakdownValue(card.id);
    return language === "zh"
      ? `【${section.label}】${value}`
      : `[${section.label}] ${value}`;
  }).join("\n");
}

function getAiBreakdownForJson() {
  const breakdown = getAiBreakdownState();
  return breakdown.cards.map((card) => {
    const section = AI_BREAKDOWN_SECTIONS.find((item) => item.id === card.id) || card;
    return {
      id: card.id,
      label: section.label || card.label,
      selectedOptionId: breakdown.selectedOptionIds[card.id] || card.options?.[0]?.id || "",
      value: getSelectedAiBreakdownValue(card.id),
      options: card.options || [],
    };
  });
}

function getResultCardState() {
  const wb = state.workbench;
  if (!wb.resultCards) wb.resultCards = clone(DEFAULT_STATE.workbench.resultCards);
  wb.resultCards.lockedIds = Array.isArray(wb.resultCards.lockedIds) ? wb.resultCards.lockedIds : [];
  wb.resultCards.cards = wb.resultCards.cards || {};
  return wb.resultCards;
}

function getOrderedResultCards() {
  const resultState = getResultCardState();
  return RESULT_CARD_TYPES.map((type) => resultState.cards[type.id] || createEmptyResultCard(type));
}

function getResultCard(id) {
  return getResultCardState().cards[id];
}

function createEmptyResultCard(type) {
  return {
    id: type.id,
    label: type.label,
    moduleType: type.moduleType,
    zh: "",
    en: "",
    updatedAt: "",
  };
}

function syncResultCards(proposedCards, options = {}) {
  const resultState = getResultCardState();
  const locked = new Set(resultState.lockedIds || []);
  proposedCards.forEach((card) => {
    const existing = resultState.cards[card.id];
    const shouldKeepExisting = existing && (locked.has(card.id) || options.preserveCards);
    resultState.cards[card.id] = shouldKeepExisting
      ? { ...card, ...existing, label: card.label, moduleType: card.moduleType }
      : card;
  });
  return getOrderedResultCards();
}

function updateResultCardValue(cardId, value) {
  const resultState = getResultCardState();
  const type = RESULT_CARD_TYPES.find((item) => item.id === cardId);
  if (!type) return;
  const existing = resultState.cards[cardId] || createEmptyResultCard(type);
  resultState.cards[cardId] = {
    ...existing,
    zh: value,
    updatedAt: new Date().toISOString(),
  };
}

function toggleResultCardLock(cardId) {
  const resultState = getResultCardState();
  resultState.lockedIds = resultState.lockedIds.includes(cardId)
    ? resultState.lockedIds.filter((id) => id !== cardId)
    : [...resultState.lockedIds, cardId];
  saveState();
}

function saveResultCardAsModule(cardId) {
  const card = getResultCard(cardId);
  const type = RESULT_CARD_TYPES.find((item) => item.id === cardId);
  if (!card || !type || !card.zh?.trim()) {
    showToast("当前卡片没有可保存的内容");
    return;
  }
  const module = {
    id: createId("module"),
    name: `${type.label} ${versionLabel()}`,
    type: type.moduleType,
    zh: card.zh.trim(),
    en: card.en || card.zh.trim(),
    tags: unique([type.label, "模块化结果", state.workbench.promptType, state.workbench.goal].filter(Boolean)),
    scenarios: state.workbench.sourceBrief || state.workbench.sceneGoal || "工作台生成结果",
    favorite: true,
    uses: 0,
    notes: "由工作台模块化结果编辑器保存。",
    updatedAt: today(),
  };
  state.modules.unshift(module);
  addTags(module.tags);
  saveState();
  showToast("已保存为存储词条");
}

function buildResultCards(payload) {
  const { projectZh, projectEn, negative, parameterLines, role, project, wb } = payload;
  const sceneValue = getSelectedAiBreakdownValue("sceneSpace") || wb.frameDescription || wb.sceneGoal || "请补充场景空间。";
  const lightingValue = getSelectedAiBreakdownValue("lightingMood") || wb.lightingControl || wb.sceneGoal || project?.lightingPreference || "请补充光影氛围。";
  const cameraValue = getSelectedAiBreakdownValue("cameraParams") || parameterLines.join("\n");
  const actionValue = getSelectedAiBreakdownValue("action") || wb.actionDetail || wb.action || role?.actions || "请补充人物动作。";
  const expressionBase = getSelectedAiBreakdownValue("microExpression") || wb.expressionDetail || role?.anger || "请补充微表情。";
  const selectedPerformancePlanPrompt = getPerformancePlanPrompt();
  const selectedPerformanceActions = getSelectedPerformanceReferenceModules().map((module) => module.zh).filter(Boolean);
  const expressionValue = [
    expressionBase,
    selectedPerformancePlanPrompt ? `【人物表演方案】\n${selectedPerformancePlanPrompt}` : "",
    ...selectedPerformanceActions.map((action, index) => `表演参考 ${index + 1}：${action}`),
  ].filter(Boolean).join("\n");
  const lensValue = getSelectedAiBreakdownValue("cameraMotion") || project?.lensLanguage || [wb.shotSize, wb.cameraAngle, wb.composition, wb.cameraSpeed].filter(Boolean).join(" / ");
  const textureValue = getSelectedAiBreakdownValue("texture") || project?.characterTexture || wb.texture || "请补充画面质感。";
  const negativeValue = getSelectedAiBreakdownValue("negative") || negative;
  const cards = {
    projectStyle: {
      zh: projectZh,
      en: projectEn,
    },
    sceneSpace: {
      zh: sceneValue,
      en: sceneValue,
    },
    lightingMood: {
      zh: lightingValue,
      en: lightingValue,
    },
    cameraParams: {
      zh: cameraValue,
      en: cameraValue,
    },
    action: {
      zh: actionValue,
      en: actionValue,
    },
    microExpression: {
      zh: expressionValue,
      en: expressionValue,
    },
    lensLanguage: {
      zh: lensValue || "请补充镜头语言。",
      en: lensValue || "Please add lens language.",
    },
    texture: {
      zh: textureValue,
      en: textureValue,
    },
    negative: {
      zh: negativeValue,
      en: negativeValue,
    },
  };
  return RESULT_CARD_TYPES.map((type) => ({
    id: type.id,
    label: type.label,
    moduleType: type.moduleType,
    zh: cards[type.id]?.zh || "",
    en: cards[type.id]?.en || cards[type.id]?.zh || "",
    updatedAt: new Date().toISOString(),
  }));
}

function renderCardsAsPrompt(cards, language = "zh") {
  return cards.map((card) => {
    const label = card.label || RESULT_CARD_TYPES.find((type) => type.id === card.id)?.label || card.id;
    const value = language === "en" ? card.en || card.zh : card.zh || card.en;
    return language === "en" ? `[${label}]\n${value || "Not set."}` : `【${label}】\n${value || "未设置。"}`;
  }).join("\n\n");
}

function buildResultCardsJson(cards, meta) {
  return JSON.stringify(
    {
      ...meta,
      resultCards: cards.map((card) => ({
        id: card.id,
        label: card.label,
        moduleType: card.moduleType,
        locked: getResultCardState().lockedIds.includes(card.id),
        zh: card.zh,
        en: card.en,
        updatedAt: card.updatedAt,
      })),
    },
    null,
    2
  );
}

function ensureWorkbenchResults() {
  const hasResultCards = Object.keys(getResultCardState().cards || {}).length > 0;
  if (!state.workbench.results || !state.workbench.results.zh || !hasResultCards) {
    regenerateResults();
  }
}

function regenerateResults(options = {}) {
  state.workbench.results = composePrompt(options);
  saveState();
  const textarea = document.getElementById("resultText");
  if (textarea) textarea.value = state.workbench.results[state.resultTab] || "";
}

function composePrompt(options = {}) {
  const wb = state.workbench;
  const role = getRole(wb.roleId);
  const project = getActiveProject();
  const mode = getWorkbenchMode();
  const task = getWorkbenchTask();
  const guidance = wb.mode === "video" ? getVideoTaskGuidance(task) : getImageTaskGuidance(task);
  const optimizationZh = (wb.optimizationNotes || []).map((item) => item.zh).filter(Boolean);
  const optimizationEn = (wb.optimizationNotes || []).map((item) => item.en).filter(Boolean);
  const coreControls = [
    `角色状态：${wb.characterState || "未选择"}`,
    `关系张力：${wb.relationTension || "未选择"}`,
    `景别：${wb.shotSize || "未选择"}`,
    `机位：${wb.cameraAngle || "未选择"}`,
    `构图：${wb.composition || "未选择"}`,
    `人物站位：${wb.blocking || "未选择"}`,
    `动作：${wb.action || "未选择"}`,
    wb.actionDetail ? `动作细节：${wb.actionDetail}` : "",
    `眼神：${wb.eye || "未选择"}`,
    `嘴部：${wb.mouth || "未选择"}`,
    `呼吸：${wb.breath || "未选择"}`,
    wb.expressionDetail ? `微表情补充：${wb.expressionDetail}` : "",
    `光线：${wb.lightingControl || "未选择"}`,
    `氛围：${wb.atmosphere || "未选择"}`,
    `画面质感：${wb.texture || "未选择"}`,
  ].filter(Boolean);
  const parameterLines = [
    `画幅比例：${wb.aspectRatio || "9:16"}`,
    `画面质量：${wb.quality || "高质量"}`,
    `风格强度：${wb.styleStrength || "中"}`,
    `运动幅度：${wb.motionLevel || "轻微"}`,
    `镜头速度：${wb.cameraSpeed || "慢"}`,
    `情绪强度：${wb.emotionIntensity || "克制"}`,
  ];
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

  const repositoryReferenceModules = getRepositoryReferenceModules(selectedModules, wb.promptType, task);
  const repositoryZh = renderRepositoryReference(repositoryReferenceModules, "zh");
  const repositoryEn = renderRepositoryReference(repositoryReferenceModules, "en");
  const projectZh = renderProjectStyleMaster(project, "zh");
  const projectEn = renderProjectStyleMaster(project, "en");
  const aiBreakdownZh = renderSelectedAiBreakdown("zh");
  const aiBreakdownEn = renderSelectedAiBreakdown("en");

  const negativeModule = selectedModules.find((item) => item.type.id === "negative");
  const negative = [
    project?.defaultNegative ? `项目默认负面提示词：${project.defaultNegative}` : "",
    role?.forbidden ? `角色禁止项：${lineToSentence(role.forbidden)}` : "",
    ...(wb.negativeOptions || []),
    wb.customNegative ? `自定义禁止项：${wb.customNegative}` : "",
    negativeModule ? `存储库负面约束：${negativeModule.zh}` : "",
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
    `【工作台模式】${mode.label}`,
    `【专业子任务】${task}`,
    `【目标工具】${wb.targetTool}`,
    `【输出格式】${wb.outputFormat}`,
    `【画面目标】${wb.goal || "未选择"}`,
    "",
    "【原始输入】",
    wb.sourceBrief || "请补充一句话需求、剧情或镜头意图。",
    "",
    "【参考图信息】",
    wb.referenceImageName ? `已选择参考图：${wb.referenceImageName}` : "未选择参考图。",
    wb.referenceNote || "无参考图识别要求。",
    "",
    "【AI专业判断】",
    guidance,
    "",
    "【项目风格母版】",
    projectZh,
    "",
    "【AI画面拆解】",
    aiBreakdownZh,
    "",
    "【角色资产】",
    roleZh,
    "",
    "【核心控制项】",
    coreControls.join("\n"),
    "",
    "【当前创作目标】",
    wb.sceneGoal || "请补充当前创作目标。",
    "",
    "【当前画面描述】",
    wb.frameDescription || "请补充画面描述。",
    "",
    "【基础参数】",
    parameterLines.join("\n"),
    "",
    "【关键存储词条】",
    moduleZh || "未选择存储词条。",
    "",
    "【存储库参考原则】",
    repositoryZh,
    "",
    "【快捷优化方向】",
    optimizationZh.length ? optimizationZh.join("\n") : "无。",
    "",
    "【临时补充要求】",
    wb.extra || "无。",
    "",
    "【负面提示词】",
    negative,
  ].join("\n");

  const en = [
    `[Workbench Mode] ${mode.label}`,
    `[Professional Task] ${task}`,
    `[Target Tool] ${wb.targetTool}`,
    `[Output Format] ${wb.outputFormat}`,
    `[Scene Goal] ${wb.goal || "Not selected"}`,
    "",
    "[Original Input]",
    wb.sourceBrief || "Please add a brief, story beat, or shot intention.",
    "",
    "[Reference Image]",
    wb.referenceImageName ? `Reference image selected: ${wb.referenceImageName}` : "No reference image selected.",
    wb.referenceNote || "No reference-image analysis note.",
    "",
    "[AI Professional Judgment]",
    guidance,
    "",
    "[Project Style Master]",
    projectEn,
    "",
    "[AI Scene Breakdown]",
    aiBreakdownEn,
    "",
    "[Character Asset]",
    roleEn,
    "",
    "[Core Controls]",
    coreControls.join("\n"),
    "",
    "[Creative Goal]",
    wb.sceneGoal || "Please add the current creative goal.",
    "",
    "[Frame Description]",
    wb.frameDescription || "Please add the current frame description.",
    "",
    "[Parameters]",
    parameterLines.join("\n"),
    "",
    "[Storage Entries]",
    moduleEn || "No storage entry selected.",
    "",
    "[Storage Repository Reference]",
    repositoryEn,
    "",
    "[Optimization Direction]",
    optimizationEn.length ? optimizationEn.join("\n") : "None.",
    "",
    "[Extra Requirements]",
    wb.extra || "None.",
    "",
    "[Negative Prompt]",
    negative,
  ].join("\n");

  const json = JSON.stringify(
    {
      mode: wb.mode,
      modeLabel: mode.label,
      task,
      promptType: wb.promptType,
      targetTool: wb.targetTool,
      outputFormat: wb.outputFormat,
      goal: wb.goal,
      sourceBrief: wb.sourceBrief,
      referenceImageName: wb.referenceImageName,
      referenceNote: wb.referenceNote,
      professionalGuidance: guidance,
      projectStyleMaster: project ? {
        id: project.id,
        name: project.name,
        visualTone: project.visualTone,
        colorLogic: project.colorLogic,
        lightingPreference: project.lightingPreference,
        lensLanguage: project.lensLanguage,
        characterTexture: project.characterTexture,
        filmGrain: project.filmGrain,
        defaultNegative: project.defaultNegative,
        defaultModel: project.defaultModel,
        defaultAspectRatio: project.defaultAspectRatio,
      } : null,
      aiSceneBreakdown: getAiBreakdownForJson(),
      performancePlan: getPerformancePlanForJson(),
      role: role ? { id: role.id, name: role.name, fixed: lines(role.fixed), variable: lines(role.variable), forbidden: lines(role.forbidden) } : null,
      sceneGoal: wb.sceneGoal,
      frameDescription: wb.frameDescription,
      coreControls: {
        characterState: wb.characterState,
        relationTension: wb.relationTension,
        shotSize: wb.shotSize,
        cameraAngle: wb.cameraAngle,
        composition: wb.composition,
        blocking: wb.blocking,
        action: wb.action,
        actionDetail: wb.actionDetail,
        eye: wb.eye,
        mouth: wb.mouth,
        breath: wb.breath,
        expressionDetail: wb.expressionDetail,
        lighting: wb.lightingControl,
        atmosphere: wb.atmosphere,
        texture: wb.texture,
      },
      parameters: {
        aspectRatio: wb.aspectRatio,
        quality: wb.quality,
        styleStrength: wb.styleStrength,
        motionLevel: wb.motionLevel,
        cameraSpeed: wb.cameraSpeed,
        emotionIntensity: wb.emotionIntensity,
      },
      modules: selectedModules.map((item) => ({
        type: item.type.label,
        name: item.module.name,
        zh: item.zh,
        en: item.en,
        tags: item.module.tags,
      })),
      repositoryReferences: repositoryReferenceModules.map((item) => ({
        type: MODULE_TYPES.find((type) => type.id === item.type)?.label || item.type,
        name: item.name,
        zh: item.zh,
        en: item.en,
        tags: item.tags,
      })),
      optimizationNotes: wb.optimizationNotes || [],
      negativePrompt: negative,
      extra: wb.extra,
    },
    null,
    2
  );

  const proposedCards = buildResultCards({
    projectZh,
    projectEn,
    negative,
    parameterLines,
    role,
    project,
    wb,
  });
  const resultCards = syncResultCards(proposedCards, { preserveCards: Boolean(options.preserveCards) });
  const modularZh = renderCardsAsPrompt(resultCards, "zh");
  const modularEn = renderCardsAsPrompt(resultCards, "en");
  const modularNegative = getResultCard("negative")?.zh || negative;
  const modularJson = buildResultCardsJson(resultCards, {
    mode: wb.mode,
    modeLabel: mode.label,
    task,
    promptType: wb.promptType,
    targetTool: wb.targetTool,
    outputFormat: wb.outputFormat,
    sourceBrief: wb.sourceBrief,
    lockedCardIds: getResultCardState().lockedIds,
    contextSnapshot: JSON.parse(json),
  });

  return { zh: modularZh, en: modularEn, negative: modularNegative, json: modularJson };
}

function renderProjectStyleMaster(project, language = "zh") {
  if (!project) {
    return language === "zh" ? "未选择项目风格母版。" : "No project style master selected.";
  }
  const labels = language === "zh"
    ? {
        name: "项目名称",
        visualTone: "画面基调",
        colorLogic: "色彩逻辑",
        lightingPreference: "光影偏好",
        lensLanguage: "镜头语言",
        characterTexture: "人物质感",
        filmGrain: "胶片颗粒",
        defaultNegative: "默认负面提示词",
        defaultModel: "默认模型",
        defaultAspectRatio: "默认比例",
      }
    : {
        name: "Project",
        visualTone: "Visual tone",
        colorLogic: "Color logic",
        lightingPreference: "Lighting preference",
        lensLanguage: "Lens language",
        characterTexture: "Character texture",
        filmGrain: "Film grain",
        defaultNegative: "Default negative prompt",
        defaultModel: "Default model",
        defaultAspectRatio: "Default aspect ratio",
      };
  return [
    `${labels.name}：${project.name || "未命名项目"}`,
    `${labels.visualTone}：${project.visualTone || "未设置"}`,
    `${labels.colorLogic}：${project.colorLogic || "未设置"}`,
    `${labels.lightingPreference}：${project.lightingPreference || "未设置"}`,
    `${labels.lensLanguage}：${project.lensLanguage || "未设置"}`,
    `${labels.characterTexture}：${project.characterTexture || "未设置"}`,
    `${labels.filmGrain}：${project.filmGrain || "未设置"}`,
    `${labels.defaultNegative}：${project.defaultNegative || "未设置"}`,
    `${labels.defaultModel}：${project.defaultModel || "未设置"}`,
    `${labels.defaultAspectRatio}：${project.defaultAspectRatio || "未设置"}`,
  ].join("\n");
}

function getRepositoryReferenceModules(selectedModules, promptType, task) {
  const selectedIds = new Set(selectedModules.map((item) => item.module.id));
  const recalledModules = getSmartRecallEntries(12).map((entry) => entry.module);
  const selectedKnowledgeModules = (state.workbench.selectedKnowledgeEntryIds || [])
    .map((entryId) => getKnowledgeRecallModule(`knowledge-entry:${entryId}`))
    .filter(Boolean);
  const selectedPerformanceModules = getSelectedPerformanceReferenceModules();
  const shouldUseExpression = [promptType, task, state.workbench.activeCategory]
    .filter(Boolean)
    .some((item) => String(item).includes("微表情") || String(item).includes("画面") || String(item).includes("视频"));
  const expressionReferences = shouldUseExpression
    ? state.modules.filter((item) => item.type === "expression" && (item.favorite || selectedIds.has(item.id)))
    : [];
  const explicitReferences = selectedModules.map((item) => item.module);
  const orderedReferences = shouldUseExpression
    ? [...selectedPerformanceModules, ...selectedKnowledgeModules, ...recalledModules, ...expressionReferences, ...explicitReferences]
    : [...selectedPerformanceModules, ...selectedKnowledgeModules, ...recalledModules, ...explicitReferences];
  return uniqueById(orderedReferences).slice(0, 12);
}

function getPerformanceRecallState() {
  const wb = state.workbench;
  wb.performanceRecall = wb.performanceRecall || clone(DEFAULT_STATE.workbench.performanceRecall);
  const availableIds = new Set(getAllPerformanceExamples().map((example) => example.id));
  wb.performanceRecall.lockedIds = (wb.performanceRecall.lockedIds || []).filter((id) => availableIds.has(id));
  wb.performanceRecall.selectedIds = (wb.performanceRecall.selectedIds || []).filter((id) => availableIds.has(id));
  return wb.performanceRecall;
}

function getPublishedUserPerformanceExamples() {
  return (state.knowledge?.entries || [])
    .filter((entry) => entry.libraryType === "expression_case" && entry.status === "published")
    .map((entry) => PERFORMANCE_DIRECTOR.knowledgeEntryToExample(entry));
}

function getAllPerformanceExamples() {
  return [...(PERFORMANCE_DATA.examples || []), ...getPublishedUserPerformanceExamples()];
}

function buildPerformanceRecallInput() {
  const wb = state.workbench;
  const role = getRole(wb.roleId);
  const recallState = wb.performanceRecall || DEFAULT_STATE.workbench.performanceRecall;
  return {
    brief: wb.sourceBrief,
    sceneGoal: wb.sceneGoal,
    frameDescription: wb.frameDescription,
    characterState: wb.characterState,
    relationTension: wb.relationTension,
    expressionDetail: wb.expressionDetail,
    actionDetail: wb.actionDetail,
    roleTemperament: role?.temperament,
    roleExpressions: [role?.anger, role?.grievance, role?.nervous, role?.cold, role?.collapse].filter(Boolean).join(" "),
    durationSeconds: Number(wb.performanceDuration) || 0,
    shotSize: wb.shotSize,
    lockedIds: recallState.lockedIds || [],
  };
}

function getPerformanceRecallEntries(limit = 5) {
  return PERFORMANCE_DIRECTOR.recallExamples(buildPerformanceRecallInput(), getAllPerformanceExamples(), limit);
}

function getPerformanceExample(id) {
  return getAllPerformanceExamples().find((example) => example.id === id);
}

function togglePerformanceExampleSelection(id) {
  if (!getPerformanceExample(id)) return;
  const recallState = getPerformanceRecallState();
  const ids = new Set(recallState.selectedIds);
  if (ids.has(id)) ids.delete(id);
  else ids.add(id);
  recallState.selectedIds = [...ids];
}

function togglePerformanceExampleLock(id) {
  if (!getPerformanceExample(id)) return;
  const recallState = getPerformanceRecallState();
  const ids = new Set(recallState.lockedIds);
  if (ids.has(id)) ids.delete(id);
  else ids.add(id);
  recallState.lockedIds = [...ids];
}

function getSelectedPerformanceReferenceModules() {
  const recallState = getPerformanceRecallState();
  return recallState.selectedIds
    .map(getPerformanceExample)
    .filter(Boolean)
    .map((example) => PERFORMANCE_DIRECTOR.exampleToReferenceModule(example));
}

function getPerformancePlanState() {
  const wb = state.workbench;
  if (!wb.performancePlan) wb.performancePlan = clone(DEFAULT_STATE.workbench.performancePlan);
  wb.performancePlan.plans = Array.isArray(wb.performancePlan.plans) ? wb.performancePlan.plans : [];
  wb.performancePlan.customPrompts = wb.performancePlan.customPrompts || {};
  const availableIds = new Set(wb.performancePlan.plans.map((plan) => plan.id));
  if (!availableIds.has(wb.performancePlan.selectedPlanId)) wb.performancePlan.selectedPlanId = wb.performancePlan.plans[0]?.id || "";
  if (!availableIds.has(wb.performancePlan.lockedPlanId)) wb.performancePlan.lockedPlanId = "";
  return wb.performancePlan;
}

function buildPerformancePlannerContext() {
  const wb = state.workbench;
  const role = getRole(wb.roleId);
  const project = getActiveProject();
  const recall = getPerformanceRecallEntries(6);
  const selectedIds = getPerformanceRecallState().selectedIds;
  const selectedResults = selectedIds
    .map(getPerformanceExample)
    .filter(Boolean)
    .map((example) => ({ example, score: 1000, reasons: ["用户主动选择"] }));
  const seen = new Set();
  const recallResults = [...selectedResults, ...recall.results].filter((item) => {
    if (seen.has(item.example.id)) return false;
    seen.add(item.example.id);
    return true;
  });
  const input = {
    ...buildPerformanceRecallInput(),
    brief: wb.sourceBrief || wb.sceneGoal || wb.frameDescription,
    context: recall.context,
    role,
    project,
    selectedReferenceIds: selectedIds,
  };
  return { input, recallResults };
}

function getCurrentPerformancePlannerSignature() {
  return PERFORMANCE_PLANNER.createSignature(buildPerformancePlannerContext().input);
}

function refreshPerformancePlanStaleIndicator() {
  const staleIndicator = document.querySelector(".performance-plan-stale");
  if (!staleIndicator) return;
  staleIndicator.hidden = getPerformancePlanState().sourceSignature === getCurrentPerformancePlannerSignature();
}

async function generatePerformancePlans() {
  const previous = getPerformancePlanState();
  const lockedPlan = previous.plans.find((plan) => plan.id === previous.lockedPlanId);
  const context = buildPerformancePlannerContext();
  const generation = await requestPerformancePlansFromModel(context);
  const generatedPlans = generation.plans;
  const plans = lockedPlan
    ? generatedPlans.map((plan) => plan.id === lockedPlan.id ? lockedPlan : plan)
    : generatedPlans;
  const availableIds = new Set(plans.map((plan) => plan.id));
  const selectedPlanId = availableIds.has(previous.selectedPlanId)
    ? previous.selectedPlanId
    : plans[0]?.id || "";
  state.workbench.performancePlan = {
    generatedAt: new Date().toISOString(),
    sourceSignature: PERFORMANCE_PLANNER.createSignature(context.input),
    plans,
    selectedPlanId: lockedPlan ? lockedPlan.id : selectedPlanId,
    lockedPlanId: lockedPlan?.id || "",
    customPrompts: lockedPlan && previous.customPrompts[lockedPlan.id]
      ? { [lockedPlan.id]: previous.customPrompts[lockedPlan.id] }
      : {},
    generatorLabel: generation.generatorLabel,
    fallbackReason: generation.fallbackReason || "",
    usage: generation.usage || null,
  };
  saveState();
  return generation;
}

async function requestPerformancePlansFromModel(context) {
  const model = getTextModelOption(state.workbench.textModelId);
  if (!model || !model.available || model.id === "local") {
    return {
      plans: generateLocalPerformancePlans(context),
      generatorLabel: "本地专业引擎",
      fallbackReason: "",
      usage: null,
    };
  }
  const apiBaseUrl = String(APP_CONFIG.apiBaseUrl || "").replace(/\/+$/, "");
  if (!apiBaseUrl) {
    return {
      plans: generateLocalPerformancePlans(context),
      generatorLabel: "本地专业引擎",
      fallbackReason: "未配置云端API地址",
      usage: null,
    };
  }
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 65_000);
  try {
    const response = await fetch(`${apiBaseUrl}/api/performance-plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model.id,
        thinking: Boolean(state.workbench.textModelThinking),
        context,
      }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `云端请求失败（${response.status}）`);
    if (!Array.isArray(data.plans) || data.plans.length !== 3) throw new Error("云端返回的方案结构无效");
    return {
      plans: data.plans,
      generatorLabel: `${model.label}${state.workbench.textModelThinking ? " / 深度思考" : ""}`,
      fallbackReason: "",
      usage: data.meta?.usage || null,
    };
  } catch (error) {
    console.warn("DeepSeek generation fallback:", error.message);
    return {
      plans: generateLocalPerformancePlans(context),
      generatorLabel: "本地专业引擎",
      fallbackReason: error.name === "AbortError" ? "请求超时" : error.message,
      usage: null,
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function generateLocalPerformancePlans(context) {
  return PERFORMANCE_PLANNER.buildPlans(context.input, context.recallResults);
}

function getTextModelOption(modelId) {
  return TEXT_MODEL_OPTIONS.find((model) => model.id === modelId) || TEXT_MODEL_OPTIONS[0];
}

function getSelectedPerformancePlan() {
  const plannerState = getPerformancePlanState();
  return plannerState.plans.find((plan) => plan.id === plannerState.selectedPlanId) || null;
}

function getPerformancePlanPrompt(planId = "") {
  const plannerState = getPerformancePlanState();
  const id = planId || plannerState.selectedPlanId;
  const plan = plannerState.plans.find((item) => item.id === id);
  return plannerState.customPrompts[id] ?? plan?.prompt ?? "";
}

function selectPerformancePlan(planId) {
  const plannerState = getPerformancePlanState();
  if (!plannerState.plans.some((plan) => plan.id === planId)) return;
  plannerState.selectedPlanId = planId;
  saveState();
}

function togglePerformancePlanLock(planId) {
  const plannerState = getPerformancePlanState();
  if (!plannerState.plans.some((plan) => plan.id === planId)) return;
  plannerState.lockedPlanId = plannerState.lockedPlanId === planId ? "" : planId;
  if (plannerState.lockedPlanId) plannerState.selectedPlanId = planId;
  saveState();
}

function updatePerformancePlanPrompt(planId, value) {
  const plannerState = getPerformancePlanState();
  if (!plannerState.plans.some((plan) => plan.id === planId)) return;
  plannerState.customPrompts[planId] = value;
  saveState();
}

function savePerformancePlanAsKnowledge(planId) {
  const plannerState = getPerformancePlanState();
  const plan = plannerState.plans.find((item) => item.id === planId);
  if (!plan) {
    showToast("没有可以保存的表演方案");
    return;
  }
  const context = buildPerformancePlannerContext();
  const payload = PERFORMANCE_PLANNER.planToKnowledgePayload(plan, context.input, getPerformancePlanPrompt(plan.id));
  const entry = KNOWLEDGE_CORE.createEntry(payload);
  state.knowledge.entries.unshift(entry);
  addTags(entry.tags);
  saveState();
  showToast("已保存为已发布的微表情案例");
}

function getPerformancePlanForJson() {
  const plan = getSelectedPerformancePlan();
  if (!plan) return null;
  return {
    id: plan.id,
    strategyId: plan.strategyId,
    title: plan.title,
    locked: getPerformancePlanState().lockedPlanId === plan.id,
    fitScore: plan.fitScore,
    durationSeconds: plan.durationSeconds,
    shotSize: plan.shotSize,
    analysis: plan.analysis,
    beats: plan.beats,
    channels: plan.channels,
    prompt: getPerformancePlanPrompt(plan.id),
    referenceIds: plan.referenceIds,
  };
}

function getSmartRecallEntries(limit = 8) {
  const lockedIds = new Set((state.workbench.lockedRecallIds || []).filter((id) => getRecallModule(id)));
  const context = buildRecallContext();
  const recallModules = [...state.modules, ...getPublishedKnowledgeRecallModules()];
  const entries = recallModules
    .map((module) => scoreModuleRecall(module, context, lockedIds.has(module.id)))
    .filter((entry) => entry.score > 0 || lockedIds.has(entry.module.id))
    .sort((a, b) => b.score - a.score || Number(b.module.favorite) - Number(a.module.favorite) || (b.module.uses || 0) - (a.module.uses || 0));
  const lockedEntries = entries.filter((entry) => lockedIds.has(entry.module.id));
  const unlockedEntries = entries.filter((entry) => !lockedIds.has(entry.module.id));
  return uniqueRecallEntries([...lockedEntries, ...unlockedEntries]).slice(0, limit);
}

function buildRecallContext() {
  const wb = state.workbench;
  const role = getRole(wb.roleId);
  const project = getActiveProject();
  const rawParts = [
    wb.sourceBrief,
    wb.sceneGoal,
    wb.frameDescription,
    wb.extra,
    wb.goal,
    wb.promptType,
    getWorkbenchTask(),
    wb.characterState,
    wb.relationTension,
    wb.shotSize,
    wb.cameraAngle,
    wb.composition,
    wb.blocking,
    wb.action,
    wb.actionDetail,
    wb.eye,
    wb.mouth,
    wb.breath,
    wb.expressionDetail,
    wb.lightingControl,
    wb.atmosphere,
    wb.texture,
    wb.customNegative,
    role?.name,
    role?.identity,
    role?.temperament,
    role?.tags?.join(" "),
    project?.name,
    project?.visualTone,
    project?.colorLogic,
    project?.lightingPreference,
    project?.lensLanguage,
  ].filter(Boolean);
  const text = normalizeRecallText(rawParts.join(" "));
  const tokens = new Set();
  rawParts.forEach((part) => extractRecallTokens(part).forEach((token) => tokens.add(token)));
  deriveRecallTokens(text).forEach((token) => tokens.add(token));
  return { text, tokens: [...tokens].filter((token) => token.length >= 2) };
}

function scoreModuleRecall(module, context, locked = false) {
  const typeLabel = getModuleTypeLabel(module.type);
  const fields = [
    ["标题", module.name, 8],
    ["中文内容", module.zh, 2],
    ["标签", (module.tags || []).join(" "), 7],
    ["适用场景", module.scenarios, 6],
    ["词条类型", typeLabel, 5],
    ["效果备注", module.notes, 2],
  ];
  let score = locked ? 1000 : 0;
  const reasons = [];
  for (const token of context.tokens) {
    for (const [label, value, weight] of fields) {
      const haystack = normalizeRecallText(value || "");
      if (!haystack || !haystack.includes(token)) continue;
      score += weight + Math.min(token.length, 6);
      if (reasons.length < 3) reasons.push(`${label}匹配「${token}」`);
      break;
    }
  }
  if (module.favorite) score += 2;
  if (module.type === state.workbench.activeCategory) score += 2;
  if (locked && reasons.length === 0) reasons.push("用户已锁定");
  return { module, score, reasons: unique(reasons) };
}

function extractRecallTokens(value) {
  const text = normalizeRecallText(value || "");
  const tokens = text
    .split(/[\s,，。；;、：:\/\\|【】\[\]（）()《》<>「」"'!?！？]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const domainTokens = [
    "夜色", "夜晚", "雨夜", "窗边", "窗边光", "愤怒", "冷怒", "愠怒", "克制", "隐忍", "压抑",
    "近景", "特写", "镜头", "光影", "侧逆光", "逆光", "电影感", "微表情", "动作", "场景",
    "委屈", "哀伤", "喜悦", "震惊", "错愕", "淡漠", "疏离", "审视", "高对比", "低饱和",
  ].filter((token) => text.includes(normalizeRecallText(token)));
  return unique([...tokens, ...domainTokens]);
}

function deriveRecallTokens(text) {
  const tokens = [];
  const rules = [
    [/夜色|夜晚|夜里|雨夜|夜戏|窗外/, ["夜色", "夜晚", "雨夜", "窗边光"]],
    [/窗边|窗户|落地窗|玻璃/, ["窗边", "窗边光", "自然光"]],
    [/压住|强忍|忍住|隐忍|克制|压抑|不爆发/, ["克制", "隐忍", "压抑", "强忍"]],
    [/愤怒|怒|生气|愠怒|冷怒/, ["愤怒", "愠怒", "冷怒", "压抑"]],
    [/真相|揭露|对峙|冲突|背叛/, ["对峙", "情绪爆发", "揭露真相"]],
    [/眼神|眼尾|红眼|泪|表情/, ["微表情", "眼神", "隐忍红眼"]],
    [/近景|特写|脸|面部|眼睛/, ["近景", "特写", "微表情"]],
    [/电影|高级|短剧|质感/, ["电影感", "高级感", "ReelShort"]],
  ];
  rules.forEach(([pattern, values]) => {
    if (pattern.test(text)) tokens.push(...values);
  });
  return unique(tokens.map(normalizeRecallText));
}

function normalizeRecallText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "");
}

function uniqueRecallEntries(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (!entry?.module?.id || seen.has(entry.module.id)) return false;
    seen.add(entry.module.id);
    return true;
  });
}

function renderRepositoryReference(modules, language = "zh") {
  const fixedRule = language === "zh"
    ? "调用AI时优先参考存储库：角色固定项和禁止项优先级最高；微表情按情绪根因、强度、眼神、眉部、嘴部、呼吸、下颌/肩颈、停顿和动作延迟拆解；输出要细腻、可拍、可控，避免模板化情绪词。"
    : "When calling AI, prioritize the storage repository: character fixed traits and forbidden constraints have the highest priority; micro-expressions must be broken down by emotional cause, intensity, eyes, brows, mouth, breath, jaw/neck/shoulders, pause, and delayed action; keep the output subtle, filmable, controllable, and avoid generic emotion words.";
  const lines = modules.map((item) => {
    const typeLabel = MODULE_TYPES.find((type) => type.id === item.type)?.label || item.type;
    const content = language === "zh" ? item.zh : item.en || item.zh;
    return `${language === "zh" ? "参考词条" : "Reference"}【${typeLabel} / ${item.name}】${content}`;
  });
  return [fixedRule, ...lines].join("\n");
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
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
  const filterType = getTempFilter("moduleType", "all");
  const moduleSearch = getTempFilter("moduleSearch", "");
  const quickTypes = getModuleQuickTypes();
  const modules = getFilteredModules();
  dom.view.innerHTML = `
    ${renderToolbar("提示词存储库", "保存AI生成时可参考的专业词条：光影、镜头、动作、微表情、质感与负面约束。", "新建词条", "module")}
    ${renderKnowledgeFoundationSummary()}
    <div class="module-filter-bar">
      <label class="module-search-field" for="moduleSearchInput">
        <i data-lucide="search"></i>
        <input id="moduleSearchInput" type="search" placeholder="搜索词条名称、中文内容、标签" value="${escapeHtml(moduleSearch)}" />
      </label>
      <div class="quick-type-strip" aria-label="常用存储类型">
        <button class="quick-type ${filterType === "all" ? "is-selected" : ""}" type="button" data-module-type-chip="all">全部</button>
        ${quickTypes.map((type) => `
          <button class="quick-type ${filterType === type.id ? "is-selected" : ""}" type="button" data-module-type-chip="${type.id}">
            ${escapeHtml(type.label)}
          </button>
        `).join("")}
      </div>
      <button class="icon-button module-quick-settings" id="moduleQuickSettingsBtn" type="button" aria-label="设置常用存储类型">
        <i data-lucide="settings"></i>
      </button>
    </div>
    <div id="moduleResults">${renderModuleResults(modules)}</div>
  `;
  document.getElementById("moduleSearchInput").addEventListener("input", (event) => {
    setTempFilter("moduleSearch", event.target.value);
    window.clearTimeout(renderModules.searchTimer);
    renderModules.searchTimer = window.setTimeout(() => {
      renderModules();
      const input = document.getElementById("moduleSearchInput");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 120);
  });
  document.querySelectorAll("[data-module-type-chip]").forEach((button) => {
    button.addEventListener("click", () => {
      setTempFilter("moduleType", button.dataset.moduleTypeChip);
      renderModules();
    });
  });
  document.getElementById("moduleQuickSettingsBtn").addEventListener("click", openModuleQuickTypeModal);
  bindAssetEvents();
}

function renderKnowledgeFoundationSummary() {
  const knowledge = KNOWLEDGE_CORE.migrateState(state.knowledge);
  const published = knowledge.entries.filter((entry) => entry.status === "published").length;
  const pending = knowledge.entries.filter((entry) => entry.status === "draft" || entry.status === "review").length;
  return `
    <section class="knowledge-foundation-strip" aria-label="专业知识库架构状态">
      <div>
        <p class="eyebrow">专业知识架构</p>
        <strong>可扩展词库底座已启用</strong>
        <span>文档摄入与审核流程将在下一阶段接入；当前旧词条保持原样。</span>
      </div>
      <dl>
        <div><dt>词库类型</dt><dd>${knowledge.libraryDefinitions.length}</dd></div>
        <div><dt>知识词条</dt><dd>${knowledge.entries.length}</dd></div>
        <div><dt>待审核</dt><dd>${pending}</dd></div>
        <div><dt>已发布</dt><dd>${published}</dd></div>
        <div><dt>数据版本</dt><dd>v${knowledge.schemaVersion}</dd></div>
      </dl>
    </section>
  `;
}

function renderIngestion() {
  const knowledge = KNOWLEDGE_CORE.migrateState(state.knowledge);
  const query = getTempFilter("ingestionSearch", "").trim().toLowerCase();
  const statusFilter = getTempFilter("ingestionStatus", "review");
  const typeFilter = getTempFilter("ingestionType", "all");
  const entries = knowledge.entries.filter((entry) => {
    const matchesQuery = !query || searchable(entry).includes(query);
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    const matchesType = typeFilter === "all" || entry.libraryType === typeFilter;
    return matchesQuery && matchesStatus && matchesType;
  });
  const pageSize = 24;
  const pageCount = Math.max(1, Math.ceil(entries.length / pageSize));
  ingestionPage = Math.min(Math.max(1, ingestionPage), pageCount);
  const visibleEntries = entries.slice((ingestionPage - 1) * pageSize, ingestionPage * pageSize);
  const statusCounts = knowledge.entries.reduce((counts, entry) => {
    counts[entry.status] = (counts[entry.status] || 0) + 1;
    return counts;
  }, {});

  dom.view.innerHTML = `
    <section class="ingestion-header">
      <div>
        <p class="eyebrow">知识摄入中心</p>
        <h2>导入专业资料</h2>
      </div>
      <div class="ingestion-header-status">
        <span>${knowledge.sourceDocuments.length} 份来源</span>
        <span>${knowledge.entries.length} 条知识</span>
      </div>
    </section>

    <section class="ingestion-upload-tool" aria-label="上传知识资料">
      <label class="ingestion-file-picker" for="ingestionFileInput">
        <i data-lucide="file-up"></i>
        <span id="ingestionFileName">选择 DOCX、TXT、MD、JSON 或 JSONL</span>
        <input id="ingestionFileInput" type="file" accept=".docx,.txt,.md,.json,.jsonl" />
      </label>
      <label class="ingestion-target-field" for="ingestionTargetType">
        <span>目标词库</span>
        <select id="ingestionTargetType">
          <option value="auto">自动识别</option>
          <option value="source_only">仅登记来源</option>
          ${knowledge.libraryDefinitions.map((definition) => `<option value="${escapeHtml(definition.id)}">${escapeHtml(definition.label)}</option>`).join("")}
        </select>
      </label>
      <button class="primary-button ingestion-process-button" id="processIngestionBtn" type="button" ${ingestionBusy ? "disabled" : ""}>
        <i data-lucide="${ingestionBusy ? "loader-circle" : "scan-text"}"></i>
        ${ingestionBusy ? "正在解析" : "解析并加入审核队列"}
      </button>
    </section>

    <section class="ingestion-stat-band" aria-label="知识状态统计">
      ${renderIngestionStat("待审核", statusCounts.review || 0, "clipboard-check")}
      ${renderIngestionStat("草稿", statusCounts.draft || 0, "file-pen-line")}
      ${renderIngestionStat("已发布", statusCounts.published || 0, "badge-check")}
      ${renderIngestionStat("已归档", statusCounts.archived || 0, "archive")}
      ${renderIngestionStat("导入任务", knowledge.ingestionJobs.length, "list-checks")}
    </section>

    <section class="ingestion-review-section" aria-label="知识审核队列">
      <div class="ingestion-section-head">
        <div>
          <p class="eyebrow">审核队列</p>
          <h3>${entries.length} 条匹配</h3>
        </div>
        <div class="ingestion-batch-actions">
          <span>${ingestionSelectedIds.size} 条已选</span>
          <button class="ghost-button compact" type="button" id="mergeKnowledgeBtn" ${ingestionSelectedIds.size < 2 ? "disabled" : ""}><i data-lucide="combine"></i>合并</button>
          <button class="ghost-button compact" type="button" data-batch-knowledge-status="published" ${ingestionSelectedIds.size ? "" : "disabled"}><i data-lucide="badge-check"></i>发布</button>
          <button class="ghost-button compact" type="button" data-batch-knowledge-status="archived" ${ingestionSelectedIds.size ? "" : "disabled"}><i data-lucide="archive"></i>归档</button>
          <button class="danger-button compact" type="button" id="deleteSelectedKnowledgeBtn" ${ingestionSelectedIds.size ? "" : "disabled"}><i data-lucide="trash-2"></i>删除</button>
        </div>
      </div>
      <div class="ingestion-filter-bar">
        <label class="module-search-field" for="ingestionSearchInput">
          <i data-lucide="search"></i>
          <input id="ingestionSearchInput" type="search" placeholder="搜索标题、内容、标签或来源" value="${escapeHtml(getTempFilter("ingestionSearch", ""))}" />
        </label>
        <select id="ingestionStatusFilter" aria-label="知识状态">
          ${[["all", "全部状态"], ["review", "待审核"], ["draft", "草稿"], ["published", "已发布"], ["archived", "已归档"]].map(([value, label]) => `<option value="${value}" ${statusFilter === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
        <select id="ingestionTypeFilter" aria-label="词库类型">
          <option value="all">全部词库</option>
          ${knowledge.libraryDefinitions.map((definition) => `<option value="${escapeHtml(definition.id)}" ${typeFilter === definition.id ? "selected" : ""}>${escapeHtml(definition.label)}</option>`).join("")}
        </select>
      </div>
      ${visibleEntries.length
        ? `<div class="knowledge-review-grid">${visibleEntries.map(renderKnowledgeReviewCard).join("")}</div>`
        : emptyState("当前筛选下没有知识词条", "上传资料或调整筛选条件。")}
      ${pageCount > 1 ? renderIngestionPagination(pageCount) : ""}
    </section>

    <section class="ingestion-source-section" aria-label="最近导入来源">
      <div class="ingestion-section-head">
        <div><p class="eyebrow">来源记录</p><h3>最近导入</h3></div>
      </div>
      ${knowledge.sourceDocuments.length
        ? `<div class="source-document-list">${knowledge.sourceDocuments.slice(0, 8).map(renderSourceDocumentRow).join("")}</div>`
        : emptyState("还没有导入来源", "选择一份资料开始建立专业词库。")}
    </section>
  `;
  bindIngestionEvents();
}

function renderIngestionStat(label, value, icon) {
  return `<div><i data-lucide="${icon}"></i><span>${escapeHtml(label)}</span><strong>${Number(value) || 0}</strong></div>`;
}

function renderKnowledgeReviewCard(entry) {
  const definition = getKnowledgeDefinition(entry.libraryType);
  const source = getKnowledgeSource(entry.sourceDocumentId);
  const selected = ingestionSelectedIds.has(entry.id);
  const confidence = Math.round((Number(entry.confidence) || 0) * 100);
  return `
    <article class="knowledge-review-card ${selected ? "is-selected" : ""}">
      <div class="knowledge-review-head">
        <label class="knowledge-select-control">
          <input type="checkbox" data-select-knowledge="${escapeHtml(entry.id)}" ${selected ? "checked" : ""} />
          <span aria-hidden="true"></span>
          <b>${escapeHtml(definition?.label || entry.libraryType)}</b>
        </label>
        <span class="knowledge-status status-${escapeHtml(entry.status)}">${escapeHtml(getKnowledgeStatusLabel(entry.status))}</span>
      </div>
      <h4>${escapeHtml(entry.title)}</h4>
      <p class="knowledge-content-preview">${escapeHtml(entry.summary || entry.contentZh)}</p>
      <div class="knowledge-review-meta">
        <span><i data-lucide="gauge"></i>${confidence}%</span>
        <span title="${escapeHtml(source?.fileName || "手动创建")}"><i data-lucide="file-text"></i>${escapeHtml(source?.fileName || "手动创建")}</span>
        <span><i data-lucide="map-pin"></i>${escapeHtml(entry.sourceLocation || "未标注")}</span>
      </div>
      <div class="tag-list">${(entry.tags || []).slice(0, 6).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="knowledge-review-actions">
        <button class="ghost-button compact" type="button" data-edit-knowledge="${escapeHtml(entry.id)}"><i data-lucide="pencil"></i>编辑</button>
        <button class="ghost-button compact" type="button" data-split-knowledge="${escapeHtml(entry.id)}"><i data-lucide="split"></i>拆分</button>
        ${entry.status === "published"
          ? `<button class="ghost-button compact" type="button" data-knowledge-status="review" data-knowledge-id="${escapeHtml(entry.id)}"><i data-lucide="undo-2"></i>退回审核</button>`
          : `<button class="primary-button compact" type="button" data-knowledge-status="published" data-knowledge-id="${escapeHtml(entry.id)}"><i data-lucide="badge-check"></i>发布</button>`}
        <button class="danger-button compact" type="button" data-delete-knowledge="${escapeHtml(entry.id)}" aria-label="删除知识词条"><i data-lucide="trash-2"></i></button>
      </div>
    </article>
  `;
}

function renderIngestionPagination(pageCount) {
  return `
    <div class="ingestion-pagination">
      <button class="ghost-button compact" type="button" data-ingestion-page="${ingestionPage - 1}" ${ingestionPage <= 1 ? "disabled" : ""}><i data-lucide="chevron-left"></i>上一页</button>
      <span>${ingestionPage} / ${pageCount}</span>
      <button class="ghost-button compact" type="button" data-ingestion-page="${ingestionPage + 1}" ${ingestionPage >= pageCount ? "disabled" : ""}>下一页<i data-lucide="chevron-right"></i></button>
    </div>
  `;
}

function renderSourceDocumentRow(source) {
  const job = state.knowledge.ingestionJobs.find((item) => item.sourceDocumentId === source.id);
  return `
    <div class="source-document-row">
      <i data-lucide="file-text"></i>
      <div><strong>${escapeHtml(source.fileName)}</strong><span>${escapeHtml(String(source.fileType || "file").toUpperCase())} / ${formatFileSize(source.fileSize)} / ${source.segmentCount || 0} 个片段</span></div>
      <span>${escapeHtml(job?.status === "completed" ? `${job.entryCount || 0} 条入队` : "仅登记")}</span>
      <time>${escapeHtml(formatDateTime(source.createdAt))}</time>
    </div>
  `;
}

function bindIngestionEvents() {
  const fileInput = document.getElementById("ingestionFileInput");
  fileInput?.addEventListener("change", () => {
    const fileName = document.getElementById("ingestionFileName");
    if (fileName) fileName.textContent = fileInput.files?.[0]?.name || "选择 DOCX、TXT、MD、JSON 或 JSONL";
  });
  document.getElementById("processIngestionBtn")?.addEventListener("click", processIngestionFile);
  document.getElementById("ingestionSearchInput")?.addEventListener("input", (event) => {
    setTempFilter("ingestionSearch", event.target.value);
    window.clearTimeout(renderIngestion.searchTimer);
    renderIngestion.searchTimer = window.setTimeout(() => {
      ingestionPage = 1;
      renderIngestion();
      document.getElementById("ingestionSearchInput")?.focus();
    }, 120);
  });
  document.getElementById("ingestionStatusFilter")?.addEventListener("change", (event) => {
    setTempFilter("ingestionStatus", event.target.value);
    ingestionPage = 1;
    renderIngestion();
  });
  document.getElementById("ingestionTypeFilter")?.addEventListener("change", (event) => {
    setTempFilter("ingestionType", event.target.value);
    ingestionPage = 1;
    renderIngestion();
  });
  document.querySelectorAll("[data-select-knowledge]").forEach((checkbox) => checkbox.addEventListener("change", () => {
    if (checkbox.checked) ingestionSelectedIds.add(checkbox.dataset.selectKnowledge);
    else ingestionSelectedIds.delete(checkbox.dataset.selectKnowledge);
    renderIngestion();
  }));
  document.querySelectorAll("[data-edit-knowledge]").forEach((button) => button.addEventListener("click", () => openKnowledgeEntryModal(getKnowledgeEntry(button.dataset.editKnowledge))));
  document.querySelectorAll("[data-split-knowledge]").forEach((button) => button.addEventListener("click", () => splitKnowledgeEntry(button.dataset.splitKnowledge)));
  document.querySelectorAll("[data-knowledge-status]").forEach((button) => button.addEventListener("click", () => updateKnowledgeEntryStatus(button.dataset.knowledgeId, button.dataset.knowledgeStatus)));
  document.querySelectorAll("[data-delete-knowledge]").forEach((button) => button.addEventListener("click", () => deleteKnowledgeEntries([button.dataset.deleteKnowledge])));
  document.querySelectorAll("[data-batch-knowledge-status]").forEach((button) => button.addEventListener("click", () => batchUpdateKnowledgeStatus(button.dataset.batchKnowledgeStatus)));
  document.getElementById("mergeKnowledgeBtn")?.addEventListener("click", mergeSelectedKnowledgeEntries);
  document.getElementById("deleteSelectedKnowledgeBtn")?.addEventListener("click", () => deleteKnowledgeEntries([...ingestionSelectedIds]));
  document.querySelectorAll("[data-ingestion-page]").forEach((button) => button.addEventListener("click", () => {
    ingestionPage = Number(button.dataset.ingestionPage) || 1;
    renderIngestion();
    dom.view.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
}

async function processIngestionFile() {
  if (ingestionBusy) return;
  const fileInput = document.getElementById("ingestionFileInput");
  const targetType = document.getElementById("ingestionTargetType")?.value || "auto";
  const file = fileInput?.files?.[0];
  if (!file) {
    showToast("请先选择需要导入的文件");
    return;
  }
  ingestionBusy = true;
  renderIngestion();
  const previousKnowledge = clone(state.knowledge);
  try {
    const parsed = await KNOWLEDGE_INGESTION.parseFile(file, window.mammoth);
    const duplicateSource = state.knowledge.sourceDocuments.find((source) => source.contentFingerprint === parsed.textFingerprint);
    if (duplicateSource) throw new Error(`该文件内容已于 ${formatDateTime(duplicateSource.createdAt)} 导入。`);
    const now = new Date().toISOString();
    const sourceDocument = {
      id: createId("source"),
      fileName: file.name,
      fileType: parsed.extension,
      fileSize: Number(file.size) || 0,
      lastModified: file.lastModified ? new Date(file.lastModified).toISOString() : "",
      contentFingerprint: parsed.textFingerprint,
      textLength: parsed.textLength,
      excerpt: parsed.excerpt,
      segmentCount: parsed.segments.length,
      warnings: parsed.warnings,
      createdAt: now,
    };
    const draftResult = targetType === "source_only"
      ? { entries: [], duplicateCount: 0 }
      : KNOWLEDGE_INGESTION.buildDraftEntries(parsed.segments, {
          sourceDocumentId: sourceDocument.id,
          targetType,
          existingEntries: state.knowledge.entries,
        });
    const ingestionJob = {
      id: createId("ingestion-job"),
      sourceDocumentId: sourceDocument.id,
      fileName: file.name,
      targetType,
      status: "completed",
      segmentCount: parsed.segments.length,
      entryCount: draftResult.entries.length,
      duplicateCount: draftResult.duplicateCount,
      warnings: parsed.warnings,
      createdAt: now,
      completedAt: now,
    };
    state.knowledge.sourceDocuments.unshift(sourceDocument);
    state.knowledge.ingestionJobs.unshift(ingestionJob);
    state.knowledge.entries.unshift(...draftResult.entries);
    const projectedSize = JSON.stringify(state).length;
    if (projectedSize > 4_500_000) {
      throw new Error("本地知识库容量接近浏览器上限，请先导出备份并拆分文件，或进入云数据库阶段。");
    }
    saveState();
    ingestionSelectedIds = new Set(draftResult.entries.map((entry) => entry.id));
    setTempFilter("ingestionStatus", draftResult.entries.length ? "review" : "all");
    ingestionPage = 1;
    const duplicateText = draftResult.duplicateCount ? `，跳过 ${draftResult.duplicateCount} 条重复内容` : "";
    showToast(`已生成 ${draftResult.entries.length} 条待审核知识${duplicateText}`);
  } catch (error) {
    state.knowledge = previousKnowledge;
    console.warn(error);
    showToast(error.message || "文件解析失败");
  } finally {
    ingestionBusy = false;
    renderIngestion();
  }
}

function recordKnowledgeEntryVersion(entry, changeType) {
  if (!entry) return;
  state.knowledge.entryVersions.unshift({
    id: createId("knowledge-version"),
    knowledgeEntryId: entry.id,
    version: entry.version || 1,
    changeType,
    snapshot: clone(entry),
    createdAt: new Date().toISOString(),
  });
}

function updateKnowledgeEntryStatus(id, status, options = {}) {
  const entry = getKnowledgeEntry(id);
  if (!entry || !KNOWLEDGE_CORE.ENTRY_STATUSES.includes(status)) return;
  recordKnowledgeEntryVersion(entry, `status:${entry.status}->${status}`);
  entry.status = status;
  entry.version = (Number(entry.version) || 1) + 1;
  entry.updatedAt = new Date().toISOString();
  entry.publishedAt = status === "published" ? entry.publishedAt || entry.updatedAt : "";
  if (status !== "published") {
    state.workbench.selectedKnowledgeEntryIds = (state.workbench.selectedKnowledgeEntryIds || []).filter((entryId) => entryId !== id);
    state.workbench.lockedRecallIds = (state.workbench.lockedRecallIds || []).filter((recallId) => recallId !== `knowledge-entry:${id}`);
  }
  if (!options.defer) {
    saveState();
    renderIngestion();
    showToast(status === "published" ? "知识词条已发布" : "知识状态已更新");
  }
}

function batchUpdateKnowledgeStatus(status) {
  const ids = [...ingestionSelectedIds].filter((id) => getKnowledgeEntry(id));
  if (!ids.length) return;
  ids.forEach((id) => updateKnowledgeEntryStatus(id, status, { defer: true }));
  ingestionSelectedIds.clear();
  saveState();
  renderIngestion();
  showToast(`已更新 ${ids.length} 条知识`);
}

function deleteKnowledgeEntries(ids) {
  const validIds = [...new Set(ids)].filter((id) => getKnowledgeEntry(id));
  if (!validIds.length) return;
  const ok = confirm(`确认删除 ${validIds.length} 条知识词条吗？来源记录和历史版本会保留。`);
  if (!ok) return;
  const idSet = new Set(validIds);
  validIds.forEach((id) => recordKnowledgeEntryVersion(getKnowledgeEntry(id), "deleted"));
  state.knowledge.entries = state.knowledge.entries.filter((entry) => !idSet.has(entry.id));
  state.workbench.selectedKnowledgeEntryIds = (state.workbench.selectedKnowledgeEntryIds || []).filter((id) => !idSet.has(id));
  state.workbench.lockedRecallIds = (state.workbench.lockedRecallIds || []).filter((recallId) => !validIds.some((id) => recallId === `knowledge-entry:${id}`));
  validIds.forEach((id) => ingestionSelectedIds.delete(id));
  saveState();
  renderIngestion();
  showToast("知识词条已删除");
}

function splitKnowledgeEntry(id) {
  const entry = getKnowledgeEntry(id);
  if (!entry) return;
  let parts = entry.contentZh.split(/\n\s*\n/g).map((item) => item.trim()).filter(Boolean);
  if (parts.length < 2) {
    const sentences = entry.contentZh.split(/(?<=[。！？!?；;])\s*/).filter(Boolean);
    if (sentences.length < 2) {
      showToast("内容太短，无法自动拆分");
      return;
    }
    const middle = Math.ceil(sentences.length / 2);
    parts = [sentences.slice(0, middle).join(""), sentences.slice(middle).join("")];
  }
  recordKnowledgeEntryVersion(entry, "split");
  entry.status = "archived";
  entry.updatedAt = new Date().toISOString();
  const created = parts.map((content, index) => KNOWLEDGE_CORE.createEntry({
    ...entry,
    id: createId("knowledge"),
    title: `${entry.title} ${index + 1}`,
    summary: content.replace(/\s+/g, " ").slice(0, 140),
    contentZh: content,
    status: "review",
    version: 1,
    publishedAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    structuredData: { ...entry.structuredData, splitFrom: entry.id, splitIndex: index },
  }));
  state.knowledge.entries.unshift(...created);
  saveState();
  renderIngestion();
  showToast(`已拆分为 ${created.length} 条待审核知识`);
}

function mergeSelectedKnowledgeEntries() {
  const entries = [...ingestionSelectedIds].map(getKnowledgeEntry).filter(Boolean);
  if (entries.length < 2) return;
  const ok = confirm(`确认合并选中的 ${entries.length} 条知识吗？原词条会归档。`);
  if (!ok) return;
  entries.forEach((entry) => {
    recordKnowledgeEntryVersion(entry, "merged");
    entry.status = "archived";
    entry.updatedAt = new Date().toISOString();
  });
  const first = entries[0];
  const merged = KNOWLEDGE_CORE.createEntry({
    libraryType: first.libraryType,
    title: `${first.title} 等 ${entries.length} 条合并`,
    summary: entries.map((entry) => entry.summary).filter(Boolean).join("；").slice(0, 140),
    contentZh: entries.map((entry) => entry.contentZh).join("\n\n"),
    contentEn: entries.map((entry) => entry.contentEn).filter(Boolean).join("\n\n"),
    tags: unique(entries.flatMap((entry) => entry.tags || [])),
    scenarios: unique(entries.flatMap((entry) => entry.scenarios || [])),
    structuredData: { mergedFrom: entries.map((entry) => entry.id) },
    sourceDocumentId: first.sourceDocumentId,
    sourceLocation: entries.map((entry) => entry.sourceLocation).filter(Boolean).join("；"),
    confidence: Math.min(...entries.map((entry) => Number(entry.confidence) || 0)),
    status: "review",
  });
  state.knowledge.entries.unshift(merged);
  ingestionSelectedIds = new Set([merged.id]);
  saveState();
  renderIngestion();
  showToast("已合并为新的待审核知识");
}

function openKnowledgeEntryModal(entry) {
  if (!entry) return;
  modalMode = "knowledgeEntry";
  modalEditingId = entry.id;
  dom.modalEyebrow.textContent = "专业知识词条";
  dom.modalTitle.textContent = `审核 ${entry.title}`;
  const source = getKnowledgeSource(entry.sourceDocumentId);
  dom.modalBody.innerHTML = `
    <section class="form-section">
      <h3>基础信息</h3>
      <div class="field-grid two-col">
        ${inputField("title", "词条标题", entry.title)}
        <div class="field">
          <label for="field-libraryType">目标词库</label>
          <select name="libraryType" id="field-libraryType">${state.knowledge.libraryDefinitions.map((definition) => `<option value="${escapeHtml(definition.id)}" ${definition.id === entry.libraryType ? "selected" : ""}>${escapeHtml(definition.label)}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label for="field-status">状态</label>
          <select name="status" id="field-status">${KNOWLEDGE_CORE.ENTRY_STATUSES.map((status) => `<option value="${status}" ${status === entry.status ? "selected" : ""}>${getKnowledgeStatusLabel(status)}</option>`).join("")}</select>
        </div>
        ${inputField("confidence", "识别置信度（0-1）", entry.confidence, "number")}
      </div>
      ${textareaField("summary", "摘要", entry.summary)}
      ${textareaField("contentZh", "中文内容", entry.contentZh)}
      ${textareaField("contentEn", "英文内容", entry.contentEn)}
      <div class="field-grid two-col">
        ${inputField("tags", "标签，用逗号分隔", (entry.tags || []).join(", "))}
        ${inputField("scenarios", "适用场景，用逗号分隔", (entry.scenarios || []).join(", "))}
      </div>
      ${textareaField("notes", "审核备注", entry.notes)}
    </section>
    <section class="form-section knowledge-source-snapshot">
      <h3>来源追溯</h3>
      <p><strong>${escapeHtml(source?.fileName || "手动创建")}</strong><span>${escapeHtml(entry.sourceLocation || "未标注位置")}</span></p>
      <small>${escapeHtml(entry.structuredData?.ingestion?.classificationReason || "人工创建或未记录分类原因")}</small>
    </section>
  `;
  const confidenceInput = dom.modalBody.querySelector('[name="confidence"]');
  if (confidenceInput) {
    confidenceInput.min = "0";
    confidenceInput.max = "1";
    confidenceInput.step = "0.01";
  }
  openModal();
}

function saveKnowledgeEntry(data) {
  const existing = getKnowledgeEntry(modalEditingId);
  if (!existing) return;
  recordKnowledgeEntryVersion(existing, "edited");
  const updated = KNOWLEDGE_CORE.createEntry({
    ...existing,
    ...data,
    id: existing.id,
    tags: parseTags(data.tags),
    scenarios: parseTags(data.scenarios),
    confidence: Number(data.confidence) || 0,
    version: (Number(existing.version) || 1) + 1,
    updatedAt: new Date().toISOString(),
    publishedAt: data.status === "published" ? existing.publishedAt || new Date().toISOString() : "",
  });
  upsert(state.knowledge.entries, updated);
  if (updated.status !== "published") {
    state.workbench.selectedKnowledgeEntryIds = (state.workbench.selectedKnowledgeEntryIds || []).filter((id) => id !== updated.id);
    state.workbench.lockedRecallIds = (state.workbench.lockedRecallIds || []).filter((id) => id !== `knowledge-entry:${updated.id}`);
  }
  addTags(updated.tags);
}

function getKnowledgeDefinition(id) {
  return state.knowledge.libraryDefinitions.find((item) => item.id === id)
    || state.knowledge.libraryDefinitions.find((item) => item.id === "uncategorized");
}

function getKnowledgeSource(id) {
  return state.knowledge.sourceDocuments.find((item) => item.id === id);
}

function getKnowledgeStatusLabel(status) {
  return { draft: "草稿", review: "待审核", published: "已发布", archived: "已归档" }[status] || status;
}

function formatFileSize(bytes) {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("zh-CN", { hour12: false });
}

function getFilteredModules() {
  const globalQuery = currentQuery();
  const moduleQuery = getTempFilter("moduleSearch", "").trim().toLowerCase();
  const filterType = getTempFilter("moduleType", "all");
  return state.modules.filter((item) => {
    const haystack = searchable(item);
    const matchGlobalQuery = !globalQuery || haystack.includes(globalQuery);
    const matchModuleQuery = !moduleQuery || haystack.includes(moduleQuery);
    const matchType = filterType === "all" || item.type === filterType;
    return matchGlobalQuery && matchModuleQuery && matchType;
  });
}

function renderModuleResults(modules) {
  return modules.length
    ? `<div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>词条</th>
            <th>类型</th>
            <th>中文内容</th>
            <th>标签</th>
            <th>使用</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>${modules.map(renderModuleRow).join("")}</tbody>
      </table>
    </div>`
    : emptyState("还没有匹配的存储词条", "换一个关键词，或通过右侧齿轮添加更多常用类型。");
}

function getModuleQuickTypes() {
  const ids = Array.isArray(state.preferences?.moduleQuickTypeIds)
    ? state.preferences.moduleQuickTypeIds
    : DEFAULT_MODULE_QUICK_TYPES;
  return ids.map((id) => MODULE_TYPES.find((type) => type.id === id)).filter(Boolean);
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
    ${renderToolbar("分类与标签管理", "用标签把角色、存储词条和完整提示词串起来，方便长期搜索复用。", "新建标签", "tag")}
    <div class="tag-manager">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>标签云</h2>
            <p>删除标签会同步从角色、存储词条和预设中移除。</p>
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
  const credentialHint = model.cloudManaged
    ? "密钥由云端 Secret 管理"
    : model.id === "model-local" ? "无需 API Key" : "请在云端网关配置密钥";
  return `
    <tr>
      <td><strong>${escapeHtml(model.name)}</strong><p class="hint">${credentialHint}</p></td>
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
  dom.view.querySelectorAll("[data-delete-module]").forEach((button) => button.addEventListener("click", () => deleteEntity("modules", button.dataset.deleteModule, "词条")));

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
  dom.modalEyebrow.textContent = "提示词存储词条";
  dom.modalTitle.textContent = module ? `编辑 ${module.name}` : "新建词条";
  const item = module || {};
  dom.modalBody.innerHTML = `
    <section class="form-section">
      <h3>词条信息</h3>
      <div class="field-grid two-col">
        ${inputField("name", "词条名称", item.name)}
        <div class="field">
          <label for="field-type">词条类型</label>
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

function openModuleQuickTypeModal() {
  modalMode = "moduleQuickTypes";
  modalEditingId = null;
  dom.modalEyebrow.textContent = "存储库筛选";
  dom.modalTitle.textContent = "设置常用类型";
  const selectedIds = new Set(state.preferences?.moduleQuickTypeIds || DEFAULT_MODULE_QUICK_TYPES);
  dom.modalBody.innerHTML = `
    <section class="form-section">
      <h3>常用快捷框</h3>
      <p class="hint">勾选后会显示在存储库搜索栏旁边，方便直接点击筛选。</p>
      <div class="checkbox-grid">
        ${MODULE_TYPES.map((type) => `
          <label class="checkbox-row">
            <input type="checkbox" name="quickTypes" value="${type.id}" ${selectedIds.has(type.id) ? "checked" : ""} />
            <span>${escapeHtml(type.label)}</span>
          </label>
        `).join("")}
      </div>
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
      <p class="hint">标签会用于角色、存储词条和完整提示词搜索。</p>
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
        ${inputField("provider", "服务商", item.provider || "")}
        ${inputField("modelId", "模型标识", item.modelId || "")}
        ${inputField("endpoint", "云端网关", item.endpoint || "云端网关")}
      </div>
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
      <p class="hint">API Key 不在网页和浏览器中保存，请通过 Cloudflare Worker Secret 或其他服务器密钥管理服务配置。</p>
      ${textareaField("notes", "备注", item.notes)}
    </section>
  `;
  openModal();
}

function openProjectModal(project = null) {
  modalMode = "project";
  modalEditingId = project?.id || null;
  dom.modalEyebrow.textContent = "项目风格母版";
  dom.modalTitle.textContent = project ? `编辑 ${project.name}` : "新建项目风格母版";
  const item = project || {};
  dom.modalBody.innerHTML = `
    <section class="form-section">
      <h3>基础信息</h3>
      <div class="field-grid three-col">
        ${inputField("name", "项目名称", item.name || "")}
        ${inputField("defaultModel", "默认模型", item.defaultModel || state.workbench.targetTool || "可灵")}
        ${inputField("defaultAspectRatio", "默认比例", item.defaultAspectRatio || state.workbench.aspectRatio || "9:16")}
      </div>
    </section>
    <section class="form-section">
      <h3>风格控制</h3>
      ${textareaField("visualTone", "画面基调", item.visualTone || "")}
      ${textareaField("colorLogic", "色彩逻辑", item.colorLogic || "")}
      ${textareaField("lightingPreference", "光影偏好", item.lightingPreference || "")}
      ${textareaField("lensLanguage", "镜头语言", item.lensLanguage || "")}
      <div class="field-grid two-col">
        ${textareaField("characterTexture", "人物质感", item.characterTexture || "")}
        ${textareaField("filmGrain", "胶片颗粒", item.filmGrain || "")}
      </div>
      ${textareaField("defaultNegative", "默认负面提示词", item.defaultNegative || "")}
    </section>
  `;
  openModal();
}

function handleModalSubmit(event) {
  event.preventDefault();
  const formData = new FormData(dom.modalForm);
  const data = Object.fromEntries(formData.entries());
  if (modalMode === "role") saveRole(data);
  if (modalMode === "module") saveModule(data);
  if (modalMode === "preset") savePreset(data);
  if (modalMode === "tag") saveTag(data.tag);
  if (modalMode === "model") saveModel(data);
  if (modalMode === "project") saveProject(data);
  if (modalMode === "moduleQuickTypes") saveModuleQuickTypes(formData);
  if (modalMode === "knowledgeEntry") saveKnowledgeEntry(data);
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

function saveModuleQuickTypes(formData) {
  const ids = formData.getAll("quickTypes").filter((id) => MODULE_TYPES.some((type) => type.id === id));
  state.preferences.moduleQuickTypeIds = ids.length ? ids : DEFAULT_MODULE_QUICK_TYPES;
  const filterType = getTempFilter("moduleType", "all");
  if (filterType !== "all" && !state.preferences.moduleQuickTypeIds.includes(filterType)) {
    setTempFilter("moduleType", "all");
  }
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
  const existing = modalEditingId ? getModel(modalEditingId) : null;
  const model = {
    id: modalEditingId || createId("model"),
    ...(existing || {}),
    ...data,
    enabled: data.enabled === "true",
    priority: Number(data.priority) || 0,
    apiKey: "",
  };
  upsert(state.models, model);
}

function saveProject(data) {
  const project = {
    id: modalEditingId || createId("project"),
    ...data,
    updatedAt: today(),
  };
  upsert(state.projects, project);
  state.activeProjectId = project.id;
  applyProjectDefaults(project);
  regenerateResults();
}

function deleteActiveProject() {
  const project = getActiveProject();
  if (!project || state.projects.length <= 1) return;
  const ok = confirm(`确认删除项目风格母版「${project.name}」吗？`);
  if (!ok) return;
  state.projects = state.projects.filter((item) => item.id !== project.id);
  state.activeProjectId = state.projects[0]?.id || DEFAULT_STATE.activeProjectId;
  applyProjectDefaults(getActiveProject());
  regenerateResults();
  saveState();
  renderWorkbench();
  showToast("项目风格母版已删除");
}

function saveCurrentPreset() {
  regenerateResults({ preserveCards: true });
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
  regenerateResults({ preserveCards: true });
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

function getKnowledgeEntry(id) {
  return state.knowledge?.entries?.find((item) => item.id === id);
}

function getPublishedKnowledgeRecallModules() {
  return KNOWLEDGE_CORE.getRecallModules(state.knowledge);
}

function getKnowledgeRecallModule(recallId) {
  return KNOWLEDGE_CORE.resolveRecallModule(state.knowledge, recallId);
}

function getRecallModule(id) {
  return getModule(id) || getKnowledgeRecallModule(id);
}

function isRecallModuleSelected(module) {
  if (module.sourceKind === "knowledge") {
    return (state.workbench.selectedKnowledgeEntryIds || []).includes(module.knowledgeEntryId);
  }
  return state.workbench.selectedModuleIds?.[module.type] === module.id;
}

function getPreset(id) {
  return state.presets.find((item) => item.id === id);
}

function getModel(id) {
  return state.models.find((item) => item.id === id);
}

function getModuleTypeLabel(typeId) {
  return MODULE_TYPES.find((item) => item.id === typeId)?.label || typeId || "词条";
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
