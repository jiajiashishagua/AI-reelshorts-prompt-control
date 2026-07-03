(function attachKnowledgeCore(global) {
  "use strict";

  const SCHEMA_VERSION = 1;
  const ENTRY_STATUSES = ["draft", "review", "published", "archived"];
  const RECALL_ID_PREFIX = "knowledge-entry:";

  const DEFAULT_LIBRARY_DEFINITIONS = [
    {
      id: "expression_rule",
      label: "微表情规则",
      description: "保存刺激、情绪控制与可见表演之间的通用规律。",
      moduleType: "expression",
      entryKind: "rule",
      structuredFields: ["triggerType", "emotionLayers", "controlStrategy", "expressionChannels", "constraints"],
    },
    {
      id: "expression_case",
      label: "微表情镜头案例",
      description: "保存包含前置状态、剧情刺激、镜头条件和结束状态的完整表演案例。",
      moduleType: "expression",
      entryKind: "case",
      structuredFields: ["previousState", "triggerType", "emotionLayers", "transition", "visibleAction", "bodyLeak", "endState", "shot"],
    },
    {
      id: "action",
      label: "人物动作",
      description: "保存人物动作、动作节奏、身体泄露和互动距离。",
      moduleType: "action",
      entryKind: "asset",
      structuredFields: ["actionGoal", "bodyParts", "timing", "intensity", "constraints"],
    },
    {
      id: "behavior",
      label: "人物行为逻辑",
      description: "保存人物目标、潜台词、决策和行为因果。",
      moduleType: "action",
      entryKind: "rule",
      structuredFields: ["characterGoal", "hiddenFear", "publicMask", "powerPosition", "behaviorArc"],
    },
    {
      id: "lighting",
      label: "光影资产",
      description: "保存光源结构、光质、色温、曝光关系和叙事氛围。",
      moduleType: "lighting",
      entryKind: "asset",
      structuredFields: ["lightSource", "direction", "quality", "colorTemperature", "contrast", "exposure", "narrativeMood"],
    },
    {
      id: "color",
      label: "色彩逻辑",
      description: "保存主辅色、冷暖关系、饱和度和叙事色彩策略。",
      moduleType: "style",
      entryKind: "asset",
      structuredFields: ["baseColors", "accentColors", "temperatureRelation", "saturation", "narrativeFunction"],
    },
    {
      id: "camera_language",
      label: "镜头语言",
      description: "保存景别、角度、机位、运动和焦点调度。",
      moduleType: "camera",
      entryKind: "asset",
      structuredFields: ["shotSize", "angle", "position", "movement", "focus", "narrativeFunction"],
    },
    {
      id: "camera_params",
      label: "相机参数",
      description: "保存摄影机、焦段、光圈、帧率、快门角和记录格式。",
      moduleType: "camera",
      entryKind: "asset",
      structuredFields: ["camera", "lens", "focalLength", "aperture", "frameRate", "shutterAngle", "iso", "whiteBalance", "recordingFormat"],
    },
    {
      id: "composition",
      label: "构图与站位",
      description: "保存构图秩序、人物站位、空间关系和视觉重心。",
      moduleType: "camera",
      entryKind: "asset",
      structuredFields: ["composition", "blocking", "spatialRelation", "visualWeight", "constraints"],
    },
    {
      id: "scene",
      label: "场景资产",
      description: "保存空间、时间、天气、材质、陈设和场景叙事信息。",
      moduleType: "scene",
      entryKind: "asset",
      structuredFields: ["space", "time", "weather", "materials", "props", "narrativeMood"],
    },
    {
      id: "texture",
      label: "画面质感",
      description: "保存成像质感、皮肤纹理、颗粒、锐度和真实感控制。",
      moduleType: "texture",
      entryKind: "asset",
      structuredFields: ["imageTexture", "skinTexture", "grain", "sharpness", "realism", "constraints"],
    },
    {
      id: "style_master",
      label: "风格母版",
      description: "保存项目级画面基调、色彩、光影、镜头和默认约束。",
      moduleType: "style",
      entryKind: "master",
      structuredFields: ["visualTone", "colorLogic", "lightingPreference", "lensLanguage", "characterTexture", "filmGrain", "defaultNegative"],
    },
    {
      id: "negative",
      label: "负面约束",
      description: "保存人物一致性、动作、画质和构图等禁止项。",
      moduleType: "negative",
      entryKind: "constraint",
      structuredFields: ["character", "anatomy", "performance", "camera", "imageQuality"],
    },
    {
      id: "uncategorized",
      label: "未分类资料",
      description: "保存尚未确定专业类型、等待人工审核的内容。",
      moduleType: "style",
      entryKind: "reference",
      structuredFields: [],
    },
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeById(defaultItems, savedItems) {
    const incoming = Array.isArray(savedItems) ? savedItems.filter((item) => item && item.id) : [];
    const incomingIds = new Set(incoming.map((item) => item.id));
    return [...incoming, ...clone(defaultItems).filter((item) => !incomingIds.has(item.id))];
  }

  function createEmptyKnowledgeState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      libraryDefinitions: clone(DEFAULT_LIBRARY_DEFINITIONS),
      sourceDocuments: [],
      ingestionJobs: [],
      entries: [],
      entryVersions: [],
    };
  }

  function normalizeEntry(entry) {
    if (!entry || !entry.id) return null;
    const status = ENTRY_STATUSES.includes(entry.status) ? entry.status : "draft";
    return {
      id: String(entry.id),
      libraryType: String(entry.libraryType || "uncategorized"),
      title: String(entry.title || "未命名知识词条"),
      summary: String(entry.summary || ""),
      contentZh: String(entry.contentZh || ""),
      contentEn: String(entry.contentEn || ""),
      tags: Array.isArray(entry.tags) ? [...new Set(entry.tags.filter(Boolean).map(String))] : [],
      scenarios: Array.isArray(entry.scenarios) ? [...new Set(entry.scenarios.filter(Boolean).map(String))] : [],
      structuredData: entry.structuredData && typeof entry.structuredData === "object" && !Array.isArray(entry.structuredData)
        ? clone(entry.structuredData)
        : {},
      sourceDocumentId: String(entry.sourceDocumentId || ""),
      sourceLocation: String(entry.sourceLocation || ""),
      confidence: Number.isFinite(Number(entry.confidence)) ? Math.max(0, Math.min(1, Number(entry.confidence))) : 0,
      status,
      version: Math.max(1, Number(entry.version) || 1),
      favorite: Boolean(entry.favorite),
      uses: Math.max(0, Number(entry.uses) || 0),
      notes: String(entry.notes || ""),
      createdAt: String(entry.createdAt || ""),
      updatedAt: String(entry.updatedAt || ""),
      publishedAt: status === "published" ? String(entry.publishedAt || entry.updatedAt || "") : "",
    };
  }

  function migrateState(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      schemaVersion: Math.max(SCHEMA_VERSION, Number(source.schemaVersion) || 0),
      libraryDefinitions: mergeById(DEFAULT_LIBRARY_DEFINITIONS, source.libraryDefinitions),
      sourceDocuments: Array.isArray(source.sourceDocuments) ? clone(source.sourceDocuments) : [],
      ingestionJobs: Array.isArray(source.ingestionJobs) ? clone(source.ingestionJobs) : [],
      entries: Array.isArray(source.entries) ? source.entries.map(normalizeEntry).filter(Boolean) : [],
      entryVersions: Array.isArray(source.entryVersions) ? clone(source.entryVersions) : [],
    };
  }

  function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function createEntry(input) {
    const now = new Date().toISOString();
    return normalizeEntry({
      id: input?.id || createId("knowledge"),
      libraryType: input?.libraryType || "uncategorized",
      title: input?.title || "未命名知识词条",
      summary: input?.summary || "",
      contentZh: input?.contentZh || "",
      contentEn: input?.contentEn || "",
      tags: input?.tags || [],
      scenarios: input?.scenarios || [],
      structuredData: input?.structuredData || {},
      sourceDocumentId: input?.sourceDocumentId || "",
      sourceLocation: input?.sourceLocation || "",
      confidence: input?.confidence ?? 0,
      status: input?.status || "draft",
      version: input?.version || 1,
      favorite: input?.favorite || false,
      uses: input?.uses || 0,
      notes: input?.notes || "",
      createdAt: input?.createdAt || now,
      updatedAt: input?.updatedAt || now,
      publishedAt: input?.publishedAt || (input?.status === "published" ? now : ""),
    });
  }

  function registerLibraryDefinition(knowledgeState, definition) {
    if (!definition?.id || !definition?.label) return migrateState(knowledgeState);
    const next = migrateState(knowledgeState);
    const normalized = {
      id: String(definition.id),
      label: String(definition.label),
      description: String(definition.description || ""),
      moduleType: String(definition.moduleType || "style"),
      entryKind: String(definition.entryKind || "asset"),
      structuredFields: Array.isArray(definition.structuredFields) ? definition.structuredFields.map(String) : [],
    };
    const index = next.libraryDefinitions.findIndex((item) => item.id === normalized.id);
    if (index >= 0) next.libraryDefinitions[index] = { ...next.libraryDefinitions[index], ...normalized };
    else next.libraryDefinitions.push(normalized);
    return next;
  }

  function getPublishedEntries(knowledgeState) {
    return migrateState(knowledgeState).entries.filter((entry) => entry.status === "published");
  }

  function getDefinition(knowledgeState, libraryType) {
    const state = migrateState(knowledgeState);
    return state.libraryDefinitions.find((item) => item.id === libraryType)
      || state.libraryDefinitions.find((item) => item.id === "uncategorized");
  }

  function entryToRecallModule(entry, knowledgeState) {
    const normalized = normalizeEntry(entry);
    if (!normalized || normalized.status !== "published") return null;
    const definition = getDefinition(knowledgeState, normalized.libraryType);
    return {
      id: `${RECALL_ID_PREFIX}${normalized.id}`,
      knowledgeEntryId: normalized.id,
      sourceKind: "knowledge",
      name: normalized.title,
      type: definition?.moduleType || "style",
      zh: normalized.contentZh || normalized.summary,
      en: normalized.contentEn || normalized.contentZh || normalized.summary,
      tags: normalized.tags,
      scenarios: normalized.scenarios.join("、"),
      favorite: normalized.favorite,
      uses: normalized.uses,
      notes: normalized.notes || `专业词库：${definition?.label || normalized.libraryType}`,
      libraryType: normalized.libraryType,
    };
  }

  function getRecallModules(knowledgeState) {
    return getPublishedEntries(knowledgeState)
      .map((entry) => entryToRecallModule(entry, knowledgeState))
      .filter(Boolean);
  }

  function resolveRecallModule(knowledgeState, recallId) {
    if (!String(recallId || "").startsWith(RECALL_ID_PREFIX)) return null;
    const entryId = String(recallId).slice(RECALL_ID_PREFIX.length);
    const entry = getPublishedEntries(knowledgeState).find((item) => item.id === entryId);
    return entry ? entryToRecallModule(entry, knowledgeState) : null;
  }

  global.KnowledgeCore = Object.freeze({
    SCHEMA_VERSION,
    ENTRY_STATUSES: clone(ENTRY_STATUSES),
    DEFAULT_LIBRARY_DEFINITIONS: clone(DEFAULT_LIBRARY_DEFINITIONS),
    createEmptyKnowledgeState,
    migrateState,
    createEntry,
    registerLibraryDefinition,
    getPublishedEntries,
    getRecallModules,
    resolveRecallModule,
    entryToRecallModule,
  });
})(typeof window !== "undefined" ? window : globalThis);
