(function attachPerformanceDirector(global) {
  "use strict";

  const WEIGHTS = {
    triggerType: 25,
    primaryEmotion: 20,
    maskEmotion: 15,
    characterBaseline: 10,
    powerPosition: 10,
    durationSeconds: 10,
    shotSize: 10,
    performancePhase: 15,
  };

  const QUERY_RULES = {
    triggerType: [
      ["秘密可能暴露", /秘密|暴露|揭穿|心虚|隐瞒/],
      ["身份或尊严被羞辱", /羞辱|物化|尊严|出身|践踏/],
      ["关系背叛", /背叛|抛弃|情敌|辜负/],
      ["真相或证据出现", /真相|证据|线索|揭露|说出/],
      ["权力压迫", /压迫|威胁|命令|居高临下|权力/],
      ["被质问或反击", /质问|反问|控诉|反击/],
    ],
    primaryEmotion: [
      ["愤怒", /愤怒|生气|怒|愠怒|冷怒/],
      ["哀伤", /悲伤|委屈|心碎|绝望|泪/],
      ["恐惧", /恐惧|害怕|惊恐|心虚|紧张/],
      ["震惊", /震惊|错愕|意外|难以置信/],
      ["冷漠", /冷漠|疏离|无动于衷/],
      ["怀疑", /怀疑|试探|审视|警惕/],
    ],
    maskEmotion: [
      ["镇定", /压住|强忍|克制|镇定|冷静|维持体面/],
      ["愤怒", /用愤怒|攻击|反击/],
      ["微笑或从容", /笑|从容|伪装/],
      ["冷漠", /冷漠|不动声色/],
    ],
    characterBaseline: [
      ["克制控制", /克制|压住|强忍|隐忍/],
      ["善于伪装", /伪装|掩饰|心虚/],
      ["冲动外放", /爆发|咆哮|冲动/],
      ["强势支配", /强势|压迫|掌控/],
      ["敏感防御", /弱势|退缩|防御/],
    ],
    powerPosition: [
      ["强势", /强势|掌控|压迫|居高临下/],
      ["弱势", /弱势|被动|退缩|无路可退/],
      ["权力转换", /反转|失去控制|由强转弱|权力变化/],
    ],
    shotSize: [
      ["大特写", /大特写/],
      ["特写", /特写/],
      ["中近景", /中近景/],
      ["近景", /近景|面部|眼睛/],
      ["中景", /中景/],
      ["全景", /全景/],
    ],
    performancePhase: [
      ["恢复", /平复|放松|缓和|释然|恢复平静/],
      ["压制", /压住|强忍|克制|隐忍|掩饰|维持体面/],
      ["释放", /爆发|咆哮|怒吼|失控|宣泄/],
      ["冻结", /停住|停滞|僵住|屏息|失语/],
    ],
  };

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  }

  function inferField(text, rules, fallback) {
    return rules.find(([, pattern]) => pattern.test(text))?.[0] || fallback;
  }

  function buildQueryContext(input = {}) {
    const text = [
      input.brief,
      input.sceneGoal,
      input.frameDescription,
      input.characterState,
      input.relationTension,
      input.expressionDetail,
      input.actionDetail,
      input.roleTemperament,
      input.roleExpressions,
    ].filter(Boolean).join(" ");
    return {
      text,
      normalizedText: normalize(text),
      triggerType: input.triggerType || inferField(text, QUERY_RULES.triggerType, "剧情信息变化"),
      primaryEmotion: input.primaryEmotion || inferField(text, QUERY_RULES.primaryEmotion, input.characterState || "复杂情绪"),
      maskEmotion: input.maskEmotion || inferField(text, QUERY_RULES.maskEmotion, "无明确面具"),
      characterBaseline: input.characterBaseline || inferField(text, QUERY_RULES.characterBaseline, "中性反应"),
      powerPosition: input.powerPosition || inferField(text, QUERY_RULES.powerPosition, "相对平衡"),
      durationSeconds: Number(input.durationSeconds) || 0,
      shotSize: input.shotSize || inferField(text, QUERY_RULES.shotSize, "未标注"),
      performancePhase: input.performancePhase || inferField(text, QUERY_RULES.performancePhase, "转变"),
      lockedIds: Array.isArray(input.lockedIds) ? input.lockedIds : [],
    };
  }

  function scoreExact(reasonLabel, actual, expected, weight, reasons) {
    if (!expected || expected === "未标注" || expected.startsWith("无明确") || expected === "复杂情绪") return 0;
    if (actual !== expected) return 0;
    reasons.push(`${reasonLabel}匹配「${expected}」`);
    return weight;
  }

  function scoreExample(example, context) {
    const reasons = [];
    let score = 0;
    score += scoreExact("刺激类型", example.triggerType, context.triggerType, WEIGHTS.triggerType, reasons);
    score += scoreExact("真实情绪", example.primaryEmotion, context.primaryEmotion, WEIGHTS.primaryEmotion, reasons);
    if (context.primaryEmotion !== "复杂情绪" && example.primaryEmotion !== context.primaryEmotion) score -= 10;
    score += scoreExact("面具情绪", example.maskEmotion, context.maskEmotion, WEIGHTS.maskEmotion, reasons);
    score += scoreExact("人物基线", example.characterBaseline, context.characterBaseline, WEIGHTS.characterBaseline, reasons);
    score += scoreExact("权力位置", example.powerPosition, context.powerPosition, WEIGHTS.powerPosition, reasons);
    score += scoreExact("镜头景别", example.shotSize, context.shotSize, WEIGHTS.shotSize, reasons);
    score += scoreExact("表演阶段", example.performancePhase, context.performancePhase, WEIGHTS.performancePhase, reasons);
    if (context.performancePhase === "压制" && example.performancePhase === "恢复") score -= 12;
    if (context.durationSeconds && example.durationSeconds) {
      const difference = Math.abs(context.durationSeconds - example.durationSeconds);
      if (difference <= 0.5) {
        score += WEIGHTS.durationSeconds;
        reasons.push(`时长接近「${example.durationSeconds}s」`);
      } else if (difference <= 1) {
        score += Math.round(WEIGHTS.durationSeconds / 2);
      }
    }
    const searchable = normalize([example.expressionDetail, example.directorIntent, ...(example.tags || [])].join(" "));
    const domainTokens = ["愤怒", "克制", "真相", "秘密", "窗边", "对峙", "恐惧", "委屈", "震惊", "冷漠"];
    domainTokens.forEach((token) => {
      if (context.normalizedText.includes(token) && searchable.includes(token)) {
        score += 3;
        if (reasons.length < 5) reasons.push(`内容匹配「${token}」`);
      }
    });
    score += Math.round((Number(example.qualityScore) || 0) * 5);
    return { example, score, reasons: [...new Set(reasons)].slice(0, 5) };
  }

  function recallExamples(input, examples, limit = 5) {
    const context = buildQueryContext(input);
    const lockedIds = new Set(context.lockedIds);
    const eligible = examples.filter((example) => example && (example.eligibleForRecall || example.status === "published"));
    const scored = eligible.map((example) => {
      const result = scoreExample(example, context);
      if (lockedIds.has(example.id)) {
        result.score += 1000;
        result.reasons.unshift("用户已锁定");
      }
      return result;
    }).filter((item) => item.score > 0 || lockedIds.has(item.example.id));
    scored.sort((a, b) => b.score - a.score || (b.example.qualityScore || 0) - (a.example.qualityScore || 0));
    const locked = scored.filter((item) => lockedIds.has(item.example.id));
    const unlocked = scored.filter((item) => !lockedIds.has(item.example.id));
    return { context, results: [...locked, ...unlocked].slice(0, limit) };
  }

  function knowledgeEntryToExample(entry) {
    const data = entry?.structuredData || {};
    const performance = data.performance || data.sourceRecord || {};
    const context = buildQueryContext({
      brief: `${entry.title || ""} ${entry.contentZh || ""} ${(entry.tags || []).join(" ")}`,
      triggerType: performance.triggerType,
      primaryEmotion: performance.primaryEmotion,
      maskEmotion: performance.maskEmotion,
      characterBaseline: performance.characterBaseline,
      performancePhase: performance.performancePhase,
      powerPosition: performance.powerPosition,
      durationSeconds: performance.durationSeconds || performance.duration_seconds,
      shotSize: performance.shotSize,
    });
    return {
      id: `knowledge-performance:${entry.id}`,
      knowledgeEntryId: entry.id,
      sourceKind: "knowledge",
      expressionDetail: entry.contentZh || entry.summary || "",
      visibleAction: performance.visibleAction || entry.contentZh || "",
      directorIntent: performance.directorIntent || entry.notes || "",
      triggerType: context.triggerType,
      primaryEmotion: context.primaryEmotion,
      secondaryEmotion: performance.secondaryEmotion || "无明显次情绪",
      maskEmotion: context.maskEmotion,
      intensity: Number(performance.intensity) || 2,
      powerPosition: context.powerPosition,
      characterBaseline: context.characterBaseline,
      performancePhase: context.performancePhase,
      expressionChannels: performance.expressionChannels || [],
      transition: performance.transition || context.primaryEmotion,
      durationSeconds: Number(performance.durationSeconds || performance.duration_seconds) || 0,
      shotSize: context.shotSize,
      focalLength: performance.focalLength || "未标注",
      qualityFlags: [],
      qualityScore: Number(entry.confidence) || 0.75,
      status: entry.status,
      eligibleForRecall: entry.status === "published",
      tags: entry.tags || [],
      sourceLocations: [entry.sourceLocation || entry.id],
    };
  }

  function exampleToReferenceModule(example) {
    let visibleAction = String(example.visibleAction || example.expressionDetail || "");
    if (example.character) visibleAction = visibleAction.split(example.character).join("人物");
    visibleAction = visibleAction.replace(/@\{[^}]+\}/g, "人物").trim();
    return {
      id: `performance-reference:${example.id}`,
      performanceExampleId: example.id,
      sourceKind: "performance",
      name: `${example.primaryEmotion} / ${example.transition}`,
      type: "expression",
      zh: visibleAction,
      en: "",
      tags: example.tags || [],
      scenarios: [example.triggerType, example.shotSize, example.durationSeconds ? `${example.durationSeconds}s` : ""].filter(Boolean).join("、"),
      favorite: false,
      uses: 0,
      notes: [
        `表演案例 ${example.sourceLocations?.join(" / ") || example.id}`,
        example.directorIntent ? `导演意图：${example.directorIntent}` : "",
      ].filter(Boolean).join("；"),
    };
  }

  global.PerformanceDirector = Object.freeze({
    WEIGHTS: { ...WEIGHTS },
    buildQueryContext,
    scoreExample,
    recallExamples,
    knowledgeEntryToExample,
    exampleToReferenceModule,
  });
})(typeof window !== "undefined" ? window : globalThis);
