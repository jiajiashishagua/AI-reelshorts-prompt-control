const STORAGE_KEY = "ai_reelshorts_prompt_control_v1";

const NAV_ITEMS = [
  { id: "workbench", label: "工作台", icon: "wand-sparkles", title: "提示词创建工作台" },
  { id: "roles", label: "角色资产", icon: "user-round-cog", title: "角色资产库" },
  { id: "modules", label: "模块库", icon: "blocks", title: "提示词模块库" },
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
  const savedWorkbench = saved.workbench || {};
  return {
    ...base,
    ...saved,
    preferences: { ...base.preferences, ...(saved.preferences || {}) },
    workbench: {
      ...base.workbench,
      ...savedWorkbench,
      selectedModuleIds: { ...base.workbench.selectedModuleIds, ...(savedWorkbench.selectedModuleIds || {}) },
      moduleOverrides: { ...base.workbench.moduleOverrides, ...(savedWorkbench.moduleOverrides || {}) },
      results: { ...base.workbench.results, ...(savedWorkbench.results || {}) },
      negativeOptions: Array.isArray(savedWorkbench.negativeOptions) ? savedWorkbench.negativeOptions : base.workbench.negativeOptions,
      optimizationNotes: Array.isArray(savedWorkbench.optimizationNotes) ? savedWorkbench.optimizationNotes : base.workbench.optimizationNotes,
    },
    roles: mergeById(base.roles, saved.roles),
    modules: mergeById(base.modules, saved.modules),
    presets: mergeById(base.presets, saved.presets),
    tags: unique([...(Array.isArray(saved.tags) ? saved.tags : []), ...base.tags]),
    models: mergeById(base.models, saved.models),
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
  if (state.activeView === "presets") renderPresets();
  if (state.activeView === "tags") renderTags();
  if (state.activeView === "models") renderModels();

  refreshIcons();
}

function renderWorkbench() {
  ensureWorkbenchResults();
  const wb = state.workbench;
  const role = getRole(wb.roleId);

  dom.view.innerHTML = `
    <div class="simple-generator-page">
      ${renderSimpleGeneratorHeader()}
      <section class="simple-generator">
        <h2>AI短视频提示词生成器</h2>
        <textarea id="wbSourceBrief" class="simple-main-input" data-workbench-field="sourceBrief" placeholder="输入你的主要想法、剧情片段或画面需求...">${escapeHtml(wb.sourceBrief || "")}</textarea>
        <textarea id="resultText" class="simple-result-input" placeholder="/ 提示词结果：">${escapeHtml(wb.results[state.resultTab] || "")}</textarea>
        <div class="simple-action-row">
          <button class="pf-button pf-primary" type="button" id="copyResultBtn">
            <i data-lucide="copy"></i>
            复制提示词
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
        <section class="simple-params-card">
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
        <a href="#modules">模块库</a>
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
          title: "可拆解模块",
          tone: "拆解",
          body: "视频提示词会拆成场景空间、光影与相机参数、人物行为逻辑、动作节奏、微表情、镜头运动、画面质感和负面约束。每个模块后续都应该给出多个可选方案，并允许用户锁定或改写。",
        },
        {
          title: "当前子任务重点",
          tone: "任务",
          body: getVideoTaskGuidance(task),
        },
        {
          title: "组合策略",
          tone: "输出",
          body: "最终结果不应只是拼接词条，而要把 AI 判断、参考图识别、角色资产和模块选择合成可直接投喂视频模型的完整提示词，并保留中文、英文、负面提示词和结构化 JSON。",
        },
      ]
    : [
        {
          title: "AI画面判断",
          tone: "判断",
          body: `当前输入会被理解为一张高质量静帧需求：先确定主体、构图、场景、光影、镜头焦段、画面质感和目标工具，再判断哪些元素必须固定，哪些可以变化。${role ? `${roleName} 的外观固定项会作为角色一致性锚点。` : ""}`,
        },
        {
          title: "可拆解模块",
          tone: "拆解",
          body: "图片提示词会拆成主体与角色、场景空间、构图景别、光影色调、相机参数、画面质感、风格参考和负面约束。后续可对每个模块给出多个专业方案。",
        },
        {
          title: "当前子任务重点",
          tone: "任务",
          body: getImageTaskGuidance(task),
        },
        {
          title: "组合策略",
          tone: "输出",
          body: "最终结果应同时适合直接生成和继续精修：既有完整提示词，也保留可锁定的模块化结构，便于复用到角色定妆、场景概念和光影资产库。",
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
    });
    input.addEventListener("change", (event) => {
      wb[key] = event.target.value;
      regenerateResults();
    });
  });

  document.querySelectorAll("[data-workbench-field]").forEach((field) => {
    field.addEventListener("input", (event) => {
      wb[event.target.dataset.workbenchField] = event.target.value;
      regenerateResults();
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
  const ok = confirm("确认清空当前工作台内容吗？角色资产和模块库不会被删除。");
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
    wb.referenceNote || "输出必须体现专业判断，不要只给简单标签；每个模块后续都应支持多方案选择、锁定和修改。",
  ].join("\n");
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

  const negativeModule = selectedModules.find((item) => item.type.id === "negative");
  const negative = [
    role?.forbidden ? `角色禁止项：${lineToSentence(role.forbidden)}` : "",
    ...(wb.negativeOptions || []),
    wb.customNegative ? `自定义禁止项：${wb.customNegative}` : "",
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
    "【关键控制模块】",
    moduleZh || "未选择模块。",
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
    "[Control Modules]",
    moduleEn || "No module selected.",
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
      optimizationNotes: wb.optimizationNotes || [],
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
  const filterType = getTempFilter("moduleType", "all");
  const moduleSearch = getTempFilter("moduleSearch", "");
  const quickTypes = getModuleQuickTypes();
  const modules = getFilteredModules();
  dom.view.innerHTML = `
    ${renderToolbar("提示词模块库", "保存可反复组合的小积木：光影、镜头、动作、微表情、质感与负面约束。", "新建模块", "module")}
    <div class="module-filter-bar">
      <label class="module-search-field" for="moduleSearchInput">
        <i data-lucide="search"></i>
        <input id="moduleSearchInput" type="search" placeholder="搜索模块名称、中文内容、标签" value="${escapeHtml(moduleSearch)}" />
      </label>
      <div class="quick-type-strip" aria-label="常用模块类型">
        <button class="quick-type ${filterType === "all" ? "is-selected" : ""}" type="button" data-module-type-chip="all">全部</button>
        ${quickTypes.map((type) => `
          <button class="quick-type ${filterType === type.id ? "is-selected" : ""}" type="button" data-module-type-chip="${type.id}">
            ${escapeHtml(type.label)}
          </button>
        `).join("")}
      </div>
      <button class="icon-button module-quick-settings" id="moduleQuickSettingsBtn" type="button" aria-label="设置常用模块类型">
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
    </div>`
    : emptyState("还没有匹配的模块", "换一个关键词，或通过右侧齿轮添加更多常用类型。");
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

function openModuleQuickTypeModal() {
  modalMode = "moduleQuickTypes";
  modalEditingId = null;
  dom.modalEyebrow.textContent = "模块库筛选";
  dom.modalTitle.textContent = "设置常用类型";
  const selectedIds = new Set(state.preferences?.moduleQuickTypeIds || DEFAULT_MODULE_QUICK_TYPES);
  dom.modalBody.innerHTML = `
    <section class="form-section">
      <h3>常用快捷框</h3>
      <p class="hint">勾选后会显示在模块库搜索栏旁边，方便直接点击筛选。</p>
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
  const formData = new FormData(dom.modalForm);
  const data = Object.fromEntries(formData.entries());
  if (modalMode === "role") saveRole(data);
  if (modalMode === "module") saveModule(data);
  if (modalMode === "preset") savePreset(data);
  if (modalMode === "tag") saveTag(data.tag);
  if (modalMode === "model") saveModel(data);
  if (modalMode === "moduleQuickTypes") saveModuleQuickTypes(formData);
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
