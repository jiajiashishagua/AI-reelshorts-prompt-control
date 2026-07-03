(function attachKnowledgeIngestion(global) {
  "use strict";

  const SUPPORTED_EXTENSIONS = ["txt", "md", "json", "jsonl", "docx"];
  const MAX_FILE_SIZE = 8 * 1024 * 1024;
  const MAX_SEGMENTS = 1200;
  const DEFAULT_CHUNK_SIZE = 1200;

  const TYPE_RULES = [
    { id: "negative", label: "负面约束", pattern: /不要|避免|禁止|负面提示|崩坏|畸形|多余手指|水印/ },
    { id: "camera_params", label: "相机参数", pattern: /\b(?:24|25|30|60)fps\b|快门角|光圈|焦段|白平衡|色温|\bISO\b|\bEI\b|ARRI|Cooke|ProRes|ARRIRAW|\d+mm/i },
    { id: "lighting", label: "光影资产", pattern: /光影|主光|辅光|逆光|侧光|顶光|窗边光|丁达尔|阴影|高光|曝光|自然光|冷光|暖光/ },
    { id: "color", label: "色彩逻辑", pattern: /色彩|色调|主色|辅色|冷暖|饱和度|莫兰迪|调色|色阶/ },
    { id: "camera_language", label: "镜头语言", pattern: /镜头|景别|特写|近景|中景|全景|远景|过肩|推镜|拉镜|摇镜|跟拍|焦点|景深/ },
    { id: "composition", label: "构图与站位", pattern: /构图|站位|机位|画面中心|视觉重心|三分法|对称|留白|前景|后景/ },
    { id: "expression_rule", label: "微表情规则", pattern: /微表情|瞳孔|眼睑|眼尾|眉心|嘴角|唇线|咬肌|下颌|眼眶|眨眼/ },
    { id: "action", label: "人物动作", pattern: /动作|手指|指节|肩膀|肩线|前倾|后退|转身|攥紧|松开|步伐|姿态/ },
    { id: "behavior", label: "人物行为逻辑", pattern: /人物目标|潜台词|隐藏目的|隐藏恐惧|权力关系|行为逻辑|主动控制|伪装/ },
    { id: "scene", label: "场景资产", pattern: /场景|空间|室内|室外|办公室|公寓|庄园|街道|荒漠|房间|天气/ },
    { id: "texture", label: "画面质感", pattern: /画面质感|胶片颗粒|皮肤纹理|锐度|清晰度|写实|CGI|渲染感|磨皮/ },
    { id: "style_master", label: "风格母版", pattern: /风格母版|画面基调|全局风格|项目风格|美学风格/ },
  ];

  const TAG_VOCABULARY = [
    "愤怒", "克制", "隐忍", "委屈", "恐惧", "震惊", "冷漠", "喜悦", "崩溃", "心虚", "动摇",
    "真相", "背叛", "对峙", "冲突", "窗边", "雨夜", "夜色", "近景", "特写", "过肩", "微推",
    "逆光", "侧逆光", "自然光", "冷光", "暖光", "低饱和", "高对比", "电影感", "写实", "胶片颗粒",
  ];

  function getExtension(fileName) {
    return String(fileName || "").split(".").pop().toLowerCase();
  }

  function normalizeText(value) {
    return String(value || "")
      .replace(/^\uFEFF/, "")
      .replace(/\r\n?/g, "\n")
      .replace(/[\t\u00a0]+/g, " ")
      .replace(/\n{4,}/g, "\n\n\n")
      .trim();
  }

  function compactText(value) {
    return normalizeText(value).replace(/\s+/g, " ").trim();
  }

  function fingerprint(value) {
    const text = compactText(value).toLowerCase();
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function splitLongText(text, maxLength = DEFAULT_CHUNK_SIZE) {
    const normalized = normalizeText(text);
    if (normalized.length <= maxLength) return [normalized];
    const sentences = normalized.split(/(?<=[。！？!?；;])\s*/).filter(Boolean);
    const chunks = [];
    let current = "";
    sentences.forEach((sentence) => {
      if (current && current.length + sentence.length > maxLength) {
        chunks.push(current.trim());
        current = "";
      }
      if (sentence.length > maxLength) {
        if (current) chunks.push(current.trim());
        current = "";
        for (let offset = 0; offset < sentence.length; offset += maxLength) {
          chunks.push(sentence.slice(offset, offset + maxLength).trim());
        }
      } else {
        current += sentence;
      }
    });
    if (current.trim()) chunks.push(current.trim());
    return chunks.filter(Boolean);
  }

  function deriveTitle(content, fallback) {
    const firstLine = compactText(content).split(/[。！？!?；;]/)[0] || fallback;
    return firstLine.length > 36 ? `${firstLine.slice(0, 36)}…` : firstLine;
  }

  function extractPromptBlocks(text) {
    if (!/^EP\d+\s*\|/m.test(text)) return [];
    return normalizeText(text)
      .split(/\n(?=EP\d+\s*\|)/g)
      .map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const title = lines.shift() || `镜头 ${index + 1}`;
        return {
          title,
          content: lines.join("\n"),
          sourceLocation: title,
          structuredData: { sourceFormat: "shot-prompt-block" },
        };
      })
      .filter((segment) => segment.content);
  }

  function extractMarkdownSections(text) {
    if (!/^#{1,6}\s+/m.test(text)) return [];
    const sections = [];
    let current = null;
    normalizeText(text).split("\n").forEach((line, index) => {
      const heading = line.match(/^#{1,6}\s+(.+)$/);
      if (heading) {
        if (current?.lines.join("\n").trim()) sections.push(current);
        current = { title: heading[1].trim(), lines: [], sourceLocation: `标题：${heading[1].trim()}` };
      } else {
        if (!current) current = { title: "文档开头", lines: [], sourceLocation: `第 ${index + 1} 行` };
        current.lines.push(line);
      }
    });
    if (current?.lines.join("\n").trim()) sections.push(current);
    return sections.flatMap((section) => splitLongText(section.lines.join("\n")).map((content, index) => ({
      title: index ? `${section.title} ${index + 1}` : section.title,
      content,
      sourceLocation: section.sourceLocation,
      structuredData: { sourceFormat: "markdown-section" },
    })));
  }

  function extractPlainSegments(text) {
    const paragraphs = normalizeText(text).split(/\n\s*\n/g).map((item) => item.trim()).filter(Boolean);
    const segments = [];
    let current = [];
    let length = 0;
    const flush = () => {
      const content = current.join("\n\n").trim();
      if (!content) return;
      splitLongText(content).forEach((chunk, index) => {
        segments.push({
          title: deriveTitle(chunk, `内容片段 ${segments.length + 1}`),
          content: chunk,
          sourceLocation: `段落 ${Math.max(1, segments.length + 1)}${index ? `-${index + 1}` : ""}`,
          structuredData: { sourceFormat: "plain-text" },
        });
      });
      current = [];
      length = 0;
    };
    paragraphs.forEach((paragraph) => {
      if (current.length && length + paragraph.length > DEFAULT_CHUNK_SIZE) flush();
      current.push(paragraph);
      length += paragraph.length;
    });
    flush();
    return segments;
  }

  function pickRecordContent(record) {
    return record.expression_detail
      || record.contentZh
      || record.content
      || record.text
      || record.description
      || record.visual_action
      || JSON.stringify(record, null, 2);
  }

  function recordToSegment(record, index) {
    const isExpressionCase = Boolean(record.expression_detail);
    const title = record.title
      || record.name
      || (record.episode != null && record.segment && record.shot != null
        ? `EP${record.episode} | ${record.segment} | Shot ${record.shot}`
        : `记录 ${index + 1}`);
    return {
      title: String(title),
      content: String(pickRecordContent(record) || ""),
      sourceLocation: String(record.sourceLocation || title),
      libraryTypeHint: isExpressionCase ? "expression_case" : "",
      structuredData: { sourceFormat: "structured-record", sourceRecord: record },
    };
  }

  function parseStructuredText(text, extension) {
    const warnings = [];
    let records = [];
    if (extension === "jsonl") {
      normalizeText(text).split("\n").forEach((line, index) => {
        if (!line.trim()) return;
        try {
          records.push(JSON.parse(line));
        } catch (error) {
          warnings.push(`第 ${index + 1} 行不是有效JSON，已跳过。`);
        }
      });
    } else {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) records = parsed;
      else {
        const nested = [parsed.entries, parsed.items, parsed.records, parsed.data].find(Array.isArray);
        records = nested || [parsed];
      }
    }
    return {
      segments: records.filter((record) => record && typeof record === "object").map(recordToSegment),
      warnings,
    };
  }

  function parseDocumentText({ fileName, text, extension = getExtension(fileName) }) {
    const normalized = normalizeText(text);
    if (!normalized) throw new Error("文档中没有可提取的文本内容。");
    let result;
    if (extension === "json" || extension === "jsonl") {
      result = parseStructuredText(normalized, extension);
    } else {
      const promptBlocks = extractPromptBlocks(normalized);
      const markdownSections = extension === "md" ? extractMarkdownSections(normalized) : [];
      result = {
        segments: promptBlocks.length ? promptBlocks : markdownSections.length ? markdownSections : extractPlainSegments(normalized),
        warnings: [],
      };
    }
    if (!result.segments.length) throw new Error("没有识别到可创建的知识片段。");
    if (result.segments.length > MAX_SEGMENTS) {
      result.warnings.push(`内容超过 ${MAX_SEGMENTS} 个片段，本次只保留前 ${MAX_SEGMENTS} 个。`);
      result.segments = result.segments.slice(0, MAX_SEGMENTS);
    }
    return { ...result, textLength: normalized.length, textFingerprint: fingerprint(normalized), excerpt: compactText(normalized).slice(0, 240) };
  }

  async function parseFile(file, mammothApi = global.mammoth) {
    if (!file) throw new Error("请选择需要导入的文件。");
    const extension = getExtension(file.name);
    if (!SUPPORTED_EXTENSIONS.includes(extension)) throw new Error("暂不支持该格式，请上传 DOCX、TXT、MD、JSON 或 JSONL。");
    if (Number(file.size) > MAX_FILE_SIZE) throw new Error("文件超过8MB，请拆分后再导入。");
    let text;
    const warnings = [];
    if (extension === "docx") {
      if (!mammothApi?.extractRawText) throw new Error("Word解析组件未加载，请联网刷新后重试。");
      const result = await mammothApi.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      text = result.value;
      (result.messages || []).forEach((message) => warnings.push(message.message || String(message)));
    } else {
      text = await file.text();
    }
    const parsed = parseDocumentText({ fileName: file.name, text, extension });
    return { ...parsed, extension, warnings: [...warnings, ...parsed.warnings] };
  }

  function suggestLibraryType(segment, forcedType = "auto") {
    if (forcedType && forcedType !== "auto") {
      return { id: forcedType, confidence: 1, reason: "用户指定目标词库" };
    }
    if (segment.libraryTypeHint) {
      return { id: segment.libraryTypeHint, confidence: 0.98, reason: "结构化字段匹配微表情镜头案例" };
    }
    const haystack = `${segment.title || ""} ${segment.content || ""}`;
    const matches = TYPE_RULES.filter((rule) => rule.pattern.test(haystack));
    if (!matches.length) return { id: "uncategorized", confidence: 0.35, reason: "未命中专业分类规则，等待人工判断" };
    return {
      id: matches[0].id,
      confidence: Math.min(0.92, 0.62 + (matches.length - 1) * 0.08),
      reason: `内容命中“${matches.map((item) => item.label).slice(0, 3).join("、")}”规则`,
    };
  }

  function extractTags(segment) {
    const haystack = `${segment.title || ""} ${segment.content || ""}`;
    return TAG_VOCABULARY.filter((tag) => haystack.includes(tag)).slice(0, 8);
  }

  function buildDraftEntries(segments, options = {}) {
    const core = global.KnowledgeCore;
    if (!core?.createEntry) throw new Error("知识库核心未加载。");
    const existing = Array.isArray(options.existingEntries) ? options.existingEntries : [];
    const fingerprints = new Set(existing.map((entry) => fingerprint(entry.contentZh)).filter(Boolean));
    const entries = [];
    let duplicateCount = 0;
    segments.forEach((segment, index) => {
      const content = normalizeText(segment.content);
      const contentFingerprint = fingerprint(content);
      if (!content || fingerprints.has(contentFingerprint)) {
        duplicateCount += 1;
        return;
      }
      fingerprints.add(contentFingerprint);
      const classification = suggestLibraryType(segment, options.targetType || "auto");
      entries.push(core.createEntry({
        libraryType: classification.id,
        title: segment.title || deriveTitle(content, `知识片段 ${index + 1}`),
        summary: compactText(content).slice(0, 140),
        contentZh: content,
        tags: extractTags(segment),
        scenarios: [],
        structuredData: {
          ...(segment.structuredData || {}),
          ingestion: {
            classificationReason: classification.reason,
            contentFingerprint,
            segmentIndex: index,
          },
        },
        sourceDocumentId: options.sourceDocumentId || "",
        sourceLocation: segment.sourceLocation || `片段 ${index + 1}`,
        confidence: classification.confidence,
        status: "review",
      }));
    });
    return { entries, duplicateCount };
  }

  global.KnowledgeIngestion = Object.freeze({
    SUPPORTED_EXTENSIONS: [...SUPPORTED_EXTENSIONS],
    MAX_FILE_SIZE,
    getExtension,
    normalizeText,
    fingerprint,
    parseDocumentText,
    parseFile,
    suggestLibraryType,
    extractTags,
    buildDraftEntries,
  });
})(typeof window !== "undefined" ? window : globalThis);
