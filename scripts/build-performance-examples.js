const fs = require("node:fs");
const path = require("node:path");

const inputPath = process.argv[2];
const outputPath = process.argv[3] || path.resolve(__dirname, "..", "data", "performance-examples.js");

if (!inputPath) {
  console.error("Usage: node scripts/build-performance-examples.js <source.jsonl> [output.js]");
  process.exit(1);
}

const EMOTION_RULES = [
  ["愤怒", /愤怒|怒意|暴怒|恼怒|咬紧|咬牙|咬肌|牙关|眉头深锁|川字纹|恶狠狠/],
  ["哀伤", /哀伤|悲伤|心碎|委屈|心寒|绝望|泪|眼眶湿润|哽咽|凄惨|破碎/],
  ["恐惧", /恐惧|害怕|惊恐|慌乱|后怕|心虚|秘密暴露|退缩|苍白|屏息/],
  ["震惊", /震惊|错愕|难以置信|意外|骤然|失语|僵住|瞳孔.*(?:扩大|收缩)/],
  ["轻蔑", /轻蔑|蔑视|讽刺|嘲弄|傲慢|冷笑|嗤笑|残忍|恶毒/],
  ["冷漠", /冷漠|无动于衷|疏离|冰冷|没有波澜|毫不动容|陌生人/],
  ["喜悦", /喜悦|开心|欣慰|释然|宠溺|温柔|窃喜|满足|笑意/],
  ["怀疑", /怀疑|审视|试探|警惕|疑惑|评估|探询/],
  ["羞耻", /羞耻|羞辱|尊严|难堪|屈辱|被物化/],
  ["决绝", /决绝|坚定|决心|不再动摇|彻底死心/],
];

const TRIGGER_RULES = [
  ["秘密可能暴露", /秘密.*暴露|被揭穿|心虚|掩饰|隐瞒/],
  ["身份或尊严被羞辱", /羞辱|物化|出身|尊严|践踏|嘲笑|恶毒/],
  ["关系背叛", /背叛|抛弃|辜负|十年|情敌|第三者/],
  ["真相或证据出现", /真相|证据|关键线索|难以置信|听见.*名字/],
  ["权力压迫", /威压|压迫|居高临下|阶级|命令|逼退/],
  ["被质问或反击", /质问|反问|控诉|审判|反击/],
  ["失去重要关系", /失去|离开|死心|关系破裂|告别/],
  ["获得希望或维护", /希望|被维护|保护|温柔|原谅|释然/],
  ["突发危险", /危险|受惊|突然|袭击|威胁|逃离/],
];

const CHANNEL_RULES = [
  ["眼神", /眼神|视线|目光|瞳孔/],
  ["眼睑与眼睫", /眼睑|眼睫|眨眼/],
  ["眼眶", /眼眶|眼尾|泪|湿润/],
  ["眉部", /眉头|眉心|眉峰|眉尾|眉间/],
  ["嘴唇与嘴角", /嘴唇|嘴角|唇线|下唇|咬唇/],
  ["下颌与咬肌", /下颌|咬肌|牙关|牙齿/],
  ["呼吸与鼻翼", /呼吸|屏息|鼻翼|吸气|呼气/],
  ["喉部", /喉部|喉结|吞咽|声音卡住/],
  ["手部", /手指|指节|手掌|攥|衣料|衣角/],
  ["肩颈与姿态", /肩|脖颈|颈部|前倾|后退|僵住|塌陷|站姿/],
];

function normalize(value) {
  return String(value || "").replace(/\s+/g, "").toLowerCase();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function parseRows(filePath) {
  return fs.readFileSync(filePath, "utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid JSON on line ${index + 1}: ${error.message}`);
      }
    });
}

function sourceId(row) {
  return `EP${row.episode}-${row.segment}-SHOT${row.shot}`;
}

function splitExpression(value) {
  const parts = String(value || "").split(/\s*——\s*/);
  return {
    visibleAction: (parts.shift() || "").trim(),
    directorIntent: parts.join("——").trim(),
  };
}

function scoreEmotions(text) {
  return EMOTION_RULES.map(([label, pattern]) => {
    const matches = String(text || "").match(new RegExp(pattern.source, "g"));
    return { label, score: matches?.length || 0 };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
}

function inferEmotion(text, fallback = "复杂情绪") {
  return scoreEmotions(text)[0]?.label || fallback;
}

function inferTrigger(text) {
  return TRIGGER_RULES.find(([, pattern]) => pattern.test(text))?.[0] || "剧情信息变化";
}

function inferMask(text) {
  if (/强行.*(?:镇定|从容|冷静|平静)|掩饰.*(?:慌乱|心虚)|把.*压回|维持体面/.test(text)) return "镇定";
  if (/用.*(?:愤怒|攻击).*掩盖|抬高下颌|重新变得锋利/.test(text)) return "愤怒";
  if (/强颜欢笑|挤出.*笑|笑意.*压住|虚伪.*从容/.test(text)) return "微笑或从容";
  if (/冷漠|无动于衷|毫无波澜/.test(text)) return "冷漠";
  return "无明确面具";
}

function inferIntensity(text, channels) {
  let score = 2;
  if (/极度|彻底|死死|剧烈|崩溃|绝望|暴怒|疯狂/.test(text)) score += 2;
  else if (/猛地|骤然|急促|狠狠|紧紧|强烈/.test(text)) score += 1;
  if (/轻微|微微|短促|克制|平静|缓慢/.test(text)) score -= 1;
  if (channels.length >= 6) score += 1;
  return Math.max(1, Math.min(5, score));
}

function inferPowerPosition(text) {
  const dominant = /居高临下|俯视|威压|命令|傲慢|压迫|掌控|强势/.test(text);
  const vulnerable = /跌坐|仰视|被逼|退缩|无路可退|毫无反抗|弱势|后退/.test(text);
  if (dominant && vulnerable) return "权力转换";
  if (dominant) return "强势";
  if (vulnerable) return "弱势";
  return "相对平衡";
}

function inferCharacterBaseline(text, maskEmotion, powerPosition) {
  if (/冲动|猛地|咆哮|粗暴|狠狠/.test(text)) return "冲动外放";
  if (/伪装|掩饰|强颜欢笑|心虚/.test(text)) return "善于伪装";
  if (maskEmotion !== "无明确面具" || /克制|压住|隐忍|维持/.test(text)) return "克制控制";
  if (powerPosition === "强势") return "强势支配";
  if (powerPosition === "弱势") return "敏感防御";
  return "中性反应";
}

function inferPerformancePhase(text) {
  if (/平复|逐渐放松|缓和|释然|松开|恢复平静/.test(text)) return "恢复";
  if (/强行|压住|压回|克制|掩饰|维持|强忍|按回/.test(text)) return "压制";
  if (/爆发|怒喝|咆哮|失控|彻底崩溃|宣泄/.test(text)) return "释放";
  if (/停滞|僵硬|定格|屏息|失语|凝固/.test(text)) return "冻结";
  return "转变";
}

function inferChannels(text) {
  return CHANNEL_RULES.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

function parseShot(camera) {
  const text = String(camera || "");
  const shotSizes = ["大特写", "中近景", "特写", "近景", "中景", "全景", "远景"];
  const angles = ["高角度俯拍", "低角度仰拍", "略高角度俯拍", "略低角度仰拍", "平视", "俯拍", "仰拍"];
  return {
    shotSize: shotSizes.find((item) => text.includes(item)) || "未标注",
    angle: angles.find((item) => text.includes(item)) || "未标注",
    focalLength: text.match(/\b(\d{2,3})mm\b/i)?.[1] ? `${text.match(/\b(\d{2,3})mm\b/i)[1]}mm` : "未标注",
    movement: ["固定微推", "微推", "缓慢推进", "固定", "跟拍", "横移", "摇镜"].find((item) => text.includes(item)) || "未标注",
  };
}

function extractCharacter(row) {
  const text = `${row.expression_detail || ""} ${row.camera || ""}`;
  const mention = text.match(/@\{([^}]+)\}/)?.[1];
  if (mention) return mention.trim();
  const prefix = String(row.expression_detail || "").match(/^([\u4e00-\u9fa5A-Za-z· ]{2,20}?)(?=眼|眉|瞳|嘴|下颌|鼻|喉|脸|面部|肩|手)/)?.[1];
  return prefix?.trim() || "";
}

function cleanDialogue(row) {
  const value = String(row.dialogue_or_voice || "").trim();
  if (!value) return { value: null, contaminated: false };
  if (/^镜头[:：]/.test(value) || normalize(value) === normalize(row.camera)) return { value: null, contaminated: true };
  return { value, contaminated: false };
}

function countModifiers(text) {
  return (String(text).match(/微微|瞬间|死死|彻底|极度|剧烈|猛地/g) || []).length;
}

function buildQualityFlags(row, visibleAction, channels, dialogue, continuityMismatch, character) {
  const flags = [];
  const text = String(row.expression_detail || "");
  if (dialogue.contaminated) flags.push("dialogue_field_cleaned");
  if (/眼睫.{0,4}睁开/.test(text)) flags.push("anatomy_error");
  if (/瞳孔.{0,10}扩大/.test(text) && /瞳孔.{0,10}收缩/.test(text) && !/随后|然后|继而|先.*后/.test(text)) flags.push("pupil_conflict");
  const actionClauses = visibleAction.split(/[，；。]/).map((item) => item.trim()).filter(Boolean).length;
  if (Number(row.duration_seconds) <= 1.5 && (channels.length >= 4 || actionClauses >= 5)) flags.push("short_shot_overload");
  if (countModifiers(text) >= 4) flags.push("modifier_overuse");
  if (!character || /焦在\s*(?:面部|，)|正打\s*，/.test(String(row.camera || ""))) flags.push("subject_missing");
  if (!visibleAction.trim()) flags.push("visible_action_missing");
  if (continuityMismatch) flags.push("continuity_mismatch");
  return flags;
}

function qualityScore(flags) {
  const penalties = {
    anatomy_error: 0.25,
    pupil_conflict: 0.2,
    short_shot_overload: 0.18,
    modifier_overuse: 0.1,
    subject_missing: 0.08,
    visible_action_missing: 0.4,
    continuity_mismatch: 0.16,
    dialogue_field_cleaned: 0.03,
  };
  return Math.max(0, Number((1 - flags.reduce((sum, flag) => sum + (penalties[flag] || 0), 0)).toFixed(2)));
}

function buildExamples(rows) {
  const expressionRows = rows.filter((row) => String(row.expression_detail || "").trim());
  const excludedRecords = rows.filter((row) => !String(row.expression_detail || "").trim()).map((row) => ({
    id: sourceId(row),
    episode: row.episode,
    segment: row.segment,
    shot: row.shot,
    reason: "expression_detail_missing",
  }));
  const duplicateGroups = new Map();
  expressionRows.forEach((row) => {
    const key = normalize(row.expression_detail);
    if (!duplicateGroups.has(key)) duplicateGroups.set(key, []);
    duplicateGroups.get(key).push(row);
  });

  const examples = [];
  const previousExpressionByEpisode = new Map();
  let duplicateCount = 0;
  let dialogueCleanedCount = 0;
  let continuityMismatchCount = 0;

  rows.forEach((row) => {
    const expression = String(row.expression_detail || "").trim();
    const previousResolved = previousExpressionByEpisode.get(row.episode) || "";
    const sourcePrevious = String(row.previous_expression || "").trim();
    const continuityMismatch = Boolean(sourcePrevious && previousResolved && normalize(sourcePrevious) !== normalize(previousResolved));
    if (continuityMismatch) continuityMismatchCount += 1;
    if (!expression) return;

    const group = duplicateGroups.get(normalize(expression)) || [];
    if (group[0] !== row) {
      duplicateCount += 1;
      previousExpressionByEpisode.set(row.episode, expression);
      return;
    }

    const { visibleAction, directorIntent } = splitExpression(expression);
    const dialogue = cleanDialogue(row);
    if (dialogue.contaminated) dialogueCleanedCount += 1;
    const analysisText = `${visibleAction} ${directorIntent} ${row.visual_action || ""} ${dialogue.value || ""}`;
    const emotions = scoreEmotions(analysisText);
    const primaryEmotion = emotions[0]?.label || "复杂情绪";
    const secondaryEmotion = emotions[1]?.label || "无明显次情绪";
    const maskEmotion = inferMask(analysisText);
    const triggerType = inferTrigger(analysisText);
    const channels = inferChannels(visibleAction);
    const powerPosition = inferPowerPosition(`${analysisText} ${row.camera || ""}`);
    const characterBaseline = inferCharacterBaseline(analysisText, maskEmotion, powerPosition);
    const performancePhase = inferPerformancePhase(analysisText);
    const intensity = inferIntensity(analysisText, channels);
    const shot = parseShot(row.camera);
    const previousEmotion = inferEmotion(sourcePrevious || previousResolved, "未知前态");
    const transition = previousEmotion === "未知前态" || previousEmotion === primaryEmotion
      ? primaryEmotion
      : `${previousEmotion}→${primaryEmotion}`;
    const character = extractCharacter(row);
    const flags = buildQualityFlags(row, visibleAction, channels, dialogue, continuityMismatch, character);
    const score = qualityScore(flags);
    const status = score >= 0.72
      && !flags.includes("anatomy_error")
      && !flags.includes("pupil_conflict")
      && !flags.includes("short_shot_overload")
      ? "published"
      : "review";
    const id = `performance-${sourceId(row).toLowerCase()}`;
    examples.push({
      id,
      episode: row.episode,
      segment: row.segment,
      shot: row.shot,
      sourceLocations: group.map((item) => sourceId(item)),
      durationSeconds: Number(row.duration_seconds) || 0,
      character,
      camera: String(row.camera || ""),
      visualAction: String(row.visual_action || ""),
      dialogueOrVoice: dialogue.value,
      previousExpression: sourcePrevious || previousResolved || null,
      expressionDetail: expression,
      visibleAction,
      directorIntent,
      triggerType,
      primaryEmotion,
      secondaryEmotion,
      maskEmotion,
      intensity,
      powerPosition,
      characterBaseline,
      performancePhase,
      expressionChannels: channels,
      transition,
      shotSize: shot.shotSize,
      cameraAngle: shot.angle,
      focalLength: shot.focalLength,
      cameraMovement: shot.movement,
      qualityFlags: flags,
      qualityScore: score,
      status,
      eligibleForRecall: status === "published",
      tags: unique([triggerType, primaryEmotion, secondaryEmotion, maskEmotion, powerPosition, characterBaseline, performancePhase, shot.shotSize, ...channels]).filter((item) => !item.startsWith("无明确") && !item.startsWith("无明显")),
    });
    previousExpressionByEpisode.set(row.episode, expression);
  });

  const qualityFlagCounts = examples.flatMap((item) => item.qualityFlags).reduce((counts, flag) => {
    counts[flag] = (counts[flag] || 0) + 1;
    return counts;
  }, {});
  return {
    examples,
    excludedRecords,
    stats: {
      sourceRows: rows.length,
      expressionRows: expressionRows.length,
      uniqueExamples: examples.length,
      excludedMissingExpression: excludedRecords.length,
      duplicateCount,
      dialogueCleanedCount,
      continuityMismatchCount,
      publishedCount: examples.filter((item) => item.status === "published").length,
      reviewCount: examples.filter((item) => item.status === "review").length,
      qualityFlagCounts,
    },
  };
}

const rows = parseRows(inputPath);
const built = buildExamples(rows);
const payload = {
  schemaVersion: 1,
  source: {
    fileName: path.basename(inputPath),
    rowCount: rows.length,
  },
  stats: built.stats,
  excludedRecords: built.excludedRecords,
  examples: built.examples,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
const output = `(function attachPerformanceExampleData(global) {\n  "use strict";\n  global.PerformanceExampleData = Object.freeze(${JSON.stringify(payload, null, 2)});\n})(typeof window !== "undefined" ? window : globalThis);\n`;
fs.writeFileSync(outputPath, output, "utf8");
console.log(JSON.stringify(payload.stats, null, 2));
