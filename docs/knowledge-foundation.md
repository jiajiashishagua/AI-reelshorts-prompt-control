# 通用知识库底座

## 目标

通用知识库用于承载微表情、动作、光影、镜头、相机参数等专业资料。现有 `modules` 数据保持不变，新知识通过统一召回适配器与旧词条共同服务工作台。

## 状态结构

```text
knowledge
  schemaVersion
  libraryDefinitions
  sourceDocuments
  ingestionJobs
  entries
  entryVersions
```

词条状态包括：

- `draft`：草稿，不参与召回。
- `review`：待审核，不参与召回。
- `published`：已发布，可以参与召回和提示词组合。
- `archived`：已归档，不参与召回。

## 默认词库

第一版注册14种类型：微表情规则、微表情镜头案例、人物动作、人物行为逻辑、光影资产、色彩逻辑、镜头语言、相机参数、构图与站位、场景资产、画面质感、风格母版、负面约束和未分类资料。

每个词库定义都包含：

- `id`：稳定类型标识。
- `label`：界面名称。
- `description`：收录范围。
- `moduleType`：映射到现有提示词模块类型。
- `entryKind`：规则、案例、资产、约束等知识形态。
- `structuredFields`：该类型的专业结构字段。

## 兼容策略

- 继续使用原有 localStorage Key，不覆盖用户已有数据。
- `mergeState()` 在读取旧数据时自动补充知识库结构和工作台选择字段。
- 默认词库与用户自定义词库按 `id` 合并。
- 新知识词条转换成只读召回模块，不改变旧模块编辑流程。
- 用户主动加入的新知识引用记录在 `selectedKnowledgeEntryIds`，不会写入旧 `selectedModuleIds`。

## 扩展新词库

通过 `KnowledgeCore.registerLibraryDefinition()` 注册新类型。后续文档摄入中心只需为该类型增加提取规则、审核表单和校验器，不需要修改底层状态结构。

## 测试

```powershell
node tests/knowledge-foundation.test.js
```

测试覆盖旧数据迁移、默认词库合并、发布状态过滤、统一召回、锁定、加入当前提示词和自定义词库注册。
