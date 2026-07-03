const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.join(root, "knowledge-core.js"));
require(path.join(root, "knowledge-ingestion.js"));

const ingestion = globalThis.KnowledgeIngestion;

const promptText = `EP1 | S01-SEG01 | Shot 1 | 2.5s
眼尾下沉，下颌线绷紧——毫无怜悯。

EP1 | S01-SEG01 | Shot 2 | 3.0s
眼睑微垂，嘴角向一侧撇出残忍的弧度。`;

const promptResult = ingestion.parseDocumentText({ fileName: "表情.txt", text: promptText });
assert.equal(promptResult.segments.length, 2);
assert.equal(promptResult.segments[0].sourceLocation, "EP1 | S01-SEG01 | Shot 1 | 2.5s");

const jsonlText = [
  JSON.stringify({ episode: 1, segment: "S01", shot: 1, expression_detail: "瞳孔短促收缩，嘴唇抿紧。", previous_expression: null }),
  "这不是JSON",
  JSON.stringify({ title: "窗边侧逆光", content: "冷调窗边侧逆光勾勒人物轮廓，暗部保留细节。" }),
  JSON.stringify({ episode: 1, segment: "S01", shot: 2, expression_detail: null, visual_action: "人物后退半步，手指松开。" }),
].join("\n");

const jsonlResult = ingestion.parseDocumentText({ fileName: "案例.jsonl", text: jsonlText });
assert.equal(jsonlResult.segments.length, 3);
assert.equal(jsonlResult.warnings.length, 1);

const built = ingestion.buildDraftEntries(jsonlResult.segments, { sourceDocumentId: "source-1" });
assert.equal(built.entries.length, 3);
assert.equal(built.entries[0].libraryType, "expression_case");
assert.equal(built.entries[1].libraryType, "lighting");
assert.equal(built.entries[2].libraryType, "action");
assert.ok(built.entries.every((entry) => entry.status === "review"));
assert.ok(built.entries.every((entry) => entry.sourceDocumentId === "source-1"));

const duplicateResult = ingestion.buildDraftEntries(jsonlResult.segments, {
  sourceDocumentId: "source-2",
  existingEntries: [built.entries[0]],
});
assert.equal(duplicateResult.entries.length, 2);
assert.equal(duplicateResult.duplicateCount, 1);

const forcedResult = ingestion.buildDraftEntries([jsonlResult.segments[1]], {
  sourceDocumentId: "source-3",
  targetType: "camera_language",
});
assert.equal(forcedResult.entries[0].libraryType, "camera_language");
assert.equal(forcedResult.entries[0].confidence, 1);

const fakeDocx = {
  name: "参考资料.docx",
  size: 1024,
  async arrayBuffer() {
    return new ArrayBuffer(8);
  },
};
const fakeMammoth = {
  async extractRawText() {
    return { value: "# 光影规则\n\n窗边侧逆光，低饱和冷调。", messages: [] };
  },
};

(async () => {
  const docxResult = await ingestion.parseFile(fakeDocx, fakeMammoth);
  assert.equal(docxResult.extension, "docx");
  assert.equal(docxResult.segments.length, 1);

  await assert.rejects(
    () => ingestion.parseFile({ name: "资料.pdf", size: 10 }),
    /暂不支持该格式/,
  );

  console.log("knowledge ingestion tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

