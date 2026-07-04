(function attachPerformancePlanner(global) {
  "use strict";

  const STRATEGIES = [
    {
      id: "restrained",
      title: "克制留白",
      intensity: "低至中",
      preferredPhases: ["压制", "冻结"],
      summary: "把真实情绪压在稳定表面下，只允许少量生理细节泄露。",
    },
    {
      id: "progressive",
      title: "递进泄露",
      intensity: "中",
      preferredPhases: ["压制", "转变", "冻结"],
      summary: "按照刺激进入、控制失效、重新收束的顺序建立清晰情绪递进。",
    },
    {
      id: "threshold",
      title: "临界释放",
      intensity: "中至高",
      preferredPhases: ["释放", "转变"],
      summary: "让情绪接近爆发边缘，但保留角色控制力和镜头可读性。",
    },
  ];

  const CHANNEL_LABELS = {
    eyes: "眼神与眼睑",
    brows: "眉部",
    mouth: "唇部与口周",
    jaw: "下颌与咬肌",
    breath: "呼吸与鼻翼",
    neck: "颈部与吞咽",
    hands: "手部",
    posture: "肩颈与身体",
    voice: "发声准备",
  };

  const CHANNEL_PATTERNS = {
    eyes: /眼|瞳孔|视线|眼睑|眼尾|眼眶|睫毛/,
    brows: /眉|眉心|眉峰/,
    mouth: /唇|嘴|口角|牙关/,
    jaw: /下颌|咬肌|颧骨|牙关/,
    breath: /呼吸|鼻翼|吸气|吐气|胸膛/,
    neck: /喉|吞咽|颈/,
    hands: /手|指|拳|衣角|袖口/,
    posture: /肩|背|身体|躯干|站姿/,
    voice: /声音|开口|语气|发声/,
  };

  const CHANNEL_ALIASES = {
    眼眶: "eyes",
    眼睑与眼睫: "eyes",
    眼神: "eyes",
    眉部: "brows",
    嘴唇与嘴角: "mouth",
    下颌与咬肌: "jaw",
    呼吸与鼻翼: "breath",
    喉部: "neck",
    手部: "hands",
    肩颈与姿态: "posture",
  };

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sanitizeAction(example) {
    let text = normalize(example?.visibleAction || example?.expressionDetail || "");
    if (example?.character) text = text.split(example.character).join("人物");
    text = text.replace(/@\{[^}]+\}/g, "人物");
    text = text.replace(/\b(Isabella|Arthur|Cecilia)\b/gi, "人物");
    return text;
  }

  function splitClauses(value) {
    return unique(normalize(value)
      .split(/[，；。！？\n]+/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 4));
  }

  function formatSecond(value) {
    return Number(value.toFixed(1)).toFixed(value % 1 === 0 ? 0 : 1);
  }

  function buildTimeRanges(durationSeconds) {
    const duration = clamp(Number(durationSeconds) || 2.5, 0.5, 10);
    const ratios = duration <= 2
      ? [0, 0.35, 1]
      : duration <= 4
        ? [0, 0.2, 0.68, 1]
        : [0, 0.15, 0.45, 0.78, 1];
    return ratios.slice(0, -1).map((ratio, index) => ({
      start: Number((duration * ratio).toFixed(1)),
      end: Number((duration * ratios[index + 1]).toFixed(1)),
      label: `${formatSecond(duration * ratio)}-${formatSecond(duration * ratios[index + 1])}s`,
    }));
  }

  function collectReferences(recalledResults) {
    return (recalledResults || [])
      .map((item) => item?.example || item)
      .filter(Boolean)
      .map((example) => ({
        example,
        action: sanitizeAction(example),
        clauses: splitClauses(sanitizeAction(example)),
      }))
      .filter((item) => item.action);
  }

  function fallbackClause(channel, context) {
    const emotion = context.primaryEmotion || "复杂情绪";
    const mask = context.maskEmotion && !context.maskEmotion.startsWith("无明确") ? context.maskEmotion : "表面稳定";
    const fallbacks = {
      eyes: `视线先停顿半拍，再重新聚焦，${emotion}只从眼神稳定度的变化中泄露`,
      brows: "眉心出现短促收紧，随后主动放松，不形成夸张皱眉",
      mouth: "唇线轻微收紧，开口前停顿，不做夸张撇嘴或咬唇",
      jaw: "下颌肌肉逐渐绷紧，但头部和脸型保持稳定",
      breath: "呼吸短暂停顿后转浅，鼻翼只出现一次轻微扩张",
      neck: "开口前出现一次克制吞咽，颈部不做大幅度后仰",
      hands: "手指缓慢收紧后停住，动作幅度控制在画面可读但不抢戏的范围",
      posture: `肩颈保持${mask}，身体不后退，只让局部肌肉张力发生变化`,
      voice: "发声前留出短暂停顿，第一口气压低，不用怒吼或哭腔替代表演",
    };
    return fallbacks[channel] || `${emotion}通过一个清晰、低幅度的生理细节泄露`;
  }

  function buildChannelDetails(references, context) {
    const explicitChannels = unique(references
      .flatMap(({ example }) => example.expressionChannels || [])
      .map((channel) => CHANNEL_ALIASES[channel] || channel));
    const candidateChannels = unique([...explicitChannels, "eyes", "mouth", "breath", "hands", "posture"]);
    return candidateChannels.slice(0, 6).map((channel) => {
      const matchingClause = references
        .flatMap((item) => item.clauses)
        .find((clause) => CHANNEL_PATTERNS[channel]?.test(clause));
      return {
        channel,
        label: CHANNEL_LABELS[channel] || channel,
        direction: matchingClause || fallbackClause(channel, context),
      };
    });
  }

  function pickClause(references, index, fallback) {
    const clauses = unique(references.flatMap((item) => item.clauses));
    return clauses[index % Math.max(clauses.length, 1)] || fallback;
  }

  function buildBeatActions(strategy, ranges, references, context) {
    const emotion = context.primaryEmotion || "复杂情绪";
    const mask = context.maskEmotion && !context.maskEmotion.startsWith("无明确") ? context.maskEmotion : "表面稳定";
    const trigger = context.triggerType || "剧情刺激出现";
    const firstLeak = pickClause(references, strategy.id === "restrained" ? 0 : 1, fallbackClause("eyes", context));
    const secondLeak = pickClause(references, strategy.id === "threshold" ? 2 : 3, fallbackClause("breath", context));
    const handLeak = pickClause(references, 4, fallbackClause("hands", context));
    const templates = {
      restrained: [
        `刺激“${trigger}”进入时先维持${mask}，不立即做出完整反应；${firstLeak}。`,
        `${emotion}只通过局部生理细节泄露：${secondLeak}；头部、肩线和身体轴线保持稳定。`,
        `准备行动或开口前把反应收回半级：${handLeak}；视线重新稳定，不哭喊、不突然转身。`,
        "用一次缓慢呼气完成收束，保留未说出口的信息，让情绪停在镜头结束之后。",
      ],
      progressive: [
        `刺激“${trigger}”出现后先冻结半拍，${firstLeak}，让观众先看见信息被人物接收。`,
        `控制开始松动，${secondLeak}；${emotion}从眼神扩散到口周和呼吸，但动作仍保持连续。`,
        `人物做出决定：${handLeak}；视线由回避转为直视，形成清晰的心理转折。`,
        `在最后一拍重新建立${mask}，把最大动作留给下一镜头，避免情绪提前耗尽。`,
      ],
      threshold: [
        `刺激“${trigger}”直接击中人物，${firstLeak}；反应速度比平常更快，但先不移动身体。`,
        `${emotion}接近临界点：${secondLeak}；允许下颌、鼻翼或胸腔张力变强，但五官不能失控。`,
        `用${handLeak}承接爆发冲动，视线锁定对方；动作到达峰值后停住，不追加多余表演。`,
        `在镜头结束前保留一口未释放的呼吸，让临界感持续，而不是彻底宣泄。`,
      ],
    };
    const actions = templates[strategy.id] || templates.progressive;
    return ranges.map((range, index) => ({
      ...range,
      phase: ["刺激进入", "控制与泄露", "决定与收束", "余韵保留"][index] || `阶段${index + 1}`,
      action: actions[index] || actions[actions.length - 1],
    }));
  }

  function strategyFit(strategy, context, references) {
    const phaseFit = strategy.preferredPhases.includes(context.performancePhase) ? 24 : 10;
    const qualityAverage = references.length
      ? references.reduce((sum, item) => sum + (Number(item.example.qualityScore) || 0.75), 0) / references.length
      : 0.65;
    const referenceFit = Math.min(18, references.length * 4);
    const score = 48 + phaseFit + referenceFit + Math.round(qualityAverage * 10);
    return clamp(score, 55, 98);
  }

  function buildNegativeConstraints(input, context) {
    const roleForbidden = splitClauses(String(input.role?.forbidden || "").replace(/\n/g, "；"));
    const projectNegative = splitClauses(input.project?.defaultNegative || "");
    return unique([
      "不要把真实情绪直接演成瞪眼、咆哮、甩头、拍桌或持续哭喊",
      "不要在一个短镜头内堆叠过多连续动作，不要让所有表情通道同时达到峰值",
      "不要出现五官漂移、脸型变化、口型崩坏、肢体扭曲或无原因的表情抽动",
      ...roleForbidden,
      ...projectNegative,
    ]).slice(0, 8);
  }

  function renderPlanPrompt(plan) {
    return [
      `【表演策略】${plan.title} / ${plan.intensity}`,
      `【刺激与心理】${plan.analysis.trigger}；真实情绪：${plan.analysis.primaryEmotion}；外在面具：${plan.analysis.maskEmotion}；表演阶段：${plan.analysis.performancePhase}。`,
      "【分秒表演节奏】",
      ...plan.beats.map((beat) => `${beat.label} ${beat.phase}：${beat.action}`),
      "【表情与身体通道】",
      ...plan.channels.map((channel) => `${channel.label}：${channel.direction}`),
      `【镜头配合】${plan.cameraGuidance}`,
      "【表演控制边界】",
      ...plan.negativeConstraints.map((item) => `- ${item}`),
    ].join("\n");
  }

  function buildPlan(strategy, input, context, references) {
    const ranges = buildTimeRanges(input.durationSeconds || context.durationSeconds);
    const channels = buildChannelDetails(references, context);
    const roleName = input.role?.name || "人物";
    const shotSize = input.shotSize || context.shotSize || "近景";
    const duration = clamp(Number(input.durationSeconds || context.durationSeconds) || 2.5, 0.5, 10);
    const plan = {
      id: `performance-plan-${strategy.id}`,
      strategyId: strategy.id,
      title: strategy.title,
      intensity: strategy.intensity,
      summary: strategy.summary,
      fitScore: strategyFit(strategy, context, references),
      analysis: {
        roleName,
        trigger: context.triggerType || "剧情刺激出现",
        primaryEmotion: context.primaryEmotion || "复杂情绪",
        maskEmotion: context.maskEmotion || "无明确面具",
        performancePhase: context.performancePhase || "转变",
        characterBaseline: context.characterBaseline || input.role?.temperament || "中性反应",
        powerPosition: context.powerPosition || "相对平衡",
      },
      durationSeconds: duration,
      shotSize,
      beats: buildBeatActions(strategy, ranges, references, context),
      channels,
      cameraGuidance: `${shotSize}，镜头时长约${duration}s，焦点优先保持在眼睛与口周，保留手部或肩颈作为第二表演层；镜头运动幅度低于人物情绪变化幅度。`,
      negativeConstraints: buildNegativeConstraints(input, context),
      referenceIds: references.slice(0, 3).map((item) => item.example.id),
      referenceLocations: unique(references.slice(0, 3).flatMap((item) => item.example.sourceLocations || [])),
    };
    plan.prompt = renderPlanPrompt(plan);
    plan.visibleSummary = plan.beats.map((beat) => beat.action).join(" ");
    return plan;
  }

  function buildPlans(input = {}, recalledResults = []) {
    const context = input.context || {
      triggerType: input.triggerType || "剧情刺激出现",
      primaryEmotion: input.primaryEmotion || "复杂情绪",
      maskEmotion: input.maskEmotion || "无明确面具",
      performancePhase: input.performancePhase || "转变",
      characterBaseline: input.characterBaseline || input.role?.temperament || "中性反应",
      powerPosition: input.powerPosition || "相对平衡",
      durationSeconds: input.durationSeconds,
      shotSize: input.shotSize,
    };
    const references = collectReferences(recalledResults).slice(0, 6);
    return STRATEGIES
      .map((strategy) => buildPlan(strategy, input, context, references))
      .sort((a, b) => b.fitScore - a.fitScore || STRATEGIES.findIndex((item) => item.id === a.strategyId) - STRATEGIES.findIndex((item) => item.id === b.strategyId));
  }

  function createSignature(input = {}) {
    return JSON.stringify({
      brief: normalize(input.brief),
      sceneGoal: normalize(input.sceneGoal),
      frameDescription: normalize(input.frameDescription),
      characterState: normalize(input.characterState),
      relationTension: normalize(input.relationTension),
      expressionDetail: normalize(input.expressionDetail),
      actionDetail: normalize(input.actionDetail),
      roleId: input.role?.id || "",
      roleTemperament: normalize(input.role?.temperament),
      roleExpressions: normalize(input.roleExpressions),
      projectId: input.project?.id || "",
      projectStyle: normalize([
        input.project?.visualTone,
        input.project?.colorLogic,
        input.project?.lightingPreference,
        input.project?.lensLanguage,
      ].filter(Boolean).join(" ")),
      durationSeconds: Number(input.durationSeconds) || 0,
      shotSize: input.shotSize || "",
      inferredContext: input.context ? {
        triggerType: input.context.triggerType || "",
        primaryEmotion: input.context.primaryEmotion || "",
        maskEmotion: input.context.maskEmotion || "",
        characterBaseline: input.context.characterBaseline || "",
        powerPosition: input.context.powerPosition || "",
        performancePhase: input.context.performancePhase || "",
      } : null,
      selectedReferenceIds: unique(input.selectedReferenceIds || []).sort(),
    });
  }

  function planToKnowledgePayload(plan, input = {}, promptOverride = "") {
    const prompt = normalize(promptOverride) ? String(promptOverride).trim() : plan.prompt;
    const tags = unique([
      "人物表演方案",
      plan.analysis.primaryEmotion,
      plan.analysis.maskEmotion,
      plan.analysis.performancePhase,
      plan.shotSize,
      `${plan.durationSeconds}s`,
      input.role?.name,
    ]);
    return {
      libraryType: "expression_case",
      title: `${input.role?.name || "人物"} / ${plan.analysis.primaryEmotion} / ${plan.title}`,
      summary: `${plan.analysis.trigger}下的${plan.title}表演方案，${plan.durationSeconds}s ${plan.shotSize}。`,
      contentZh: prompt,
      tags,
      scenarios: unique([input.brief, plan.analysis.trigger]).filter(Boolean),
      confidence: plan.fitScore / 100,
      status: "published",
      favorite: true,
      notes: `由人物表演方案生成器保存；参考案例：${plan.referenceLocations.join(" / ") || "本地规则"}`,
      structuredData: {
        performance: {
          triggerType: plan.analysis.trigger,
          primaryEmotion: plan.analysis.primaryEmotion,
          maskEmotion: plan.analysis.maskEmotion,
          characterBaseline: plan.analysis.characterBaseline,
          powerPosition: plan.analysis.powerPosition,
          performancePhase: plan.analysis.performancePhase,
          durationSeconds: plan.durationSeconds,
          shotSize: plan.shotSize,
          visibleAction: plan.visibleSummary,
          directorIntent: plan.summary,
          expressionChannels: plan.channels.map((item) => item.channel),
          transition: `${plan.analysis.maskEmotion}→${plan.analysis.primaryEmotion}`,
        },
        planner: {
          strategyId: plan.strategyId,
          beats: plan.beats,
          channels: plan.channels,
          negativeConstraints: plan.negativeConstraints,
          referenceIds: plan.referenceIds,
        },
      },
    };
  }

  global.PerformancePlanner = Object.freeze({
    STRATEGIES: STRATEGIES.map((item) => ({ ...item })),
    buildTimeRanges,
    sanitizeAction,
    buildPlans,
    renderPlanPrompt,
    createSignature,
    planToKnowledgePayload,
  });
})(typeof window !== "undefined" ? window : globalThis);
