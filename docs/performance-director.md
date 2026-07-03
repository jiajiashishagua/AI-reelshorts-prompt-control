# 人物表演案例清洗与召回

## 功能目标

本模块把人物表演资料从“情绪标签库”升级为可检索的镜头案例库。召回时不只判断愤怒、哀伤等表层情绪，还同时考虑刺激来源、人物真正感受、外在面具、权力关系、表演阶段、景别和镜头时长。

工作台中的标准流程为：

```text
输入剧情与场景
  -> 推断剧情刺激和人物状态
  -> 召回已发布的表演案例
  -> 用户选择或锁定案例
  -> 提取可见动作，写入【微表情】卡片
  -> 组合完整提示词
```

## 数据清洗结果

当前数据源包含 392 条镜头记录：

- 370 条含有效表情描述。
- 22 条缺少表情描述，不进入案例库。
- 4 条完全重复的表情描述被合并，并保留全部来源位置。
- 最终生成 366 条唯一案例。
- 354 条状态为 `published`，可以参与召回。
- 12 条状态为 `review`，需要人工审核后才能参与召回。

清洗脚本会拆分可见动作与导演意图、清理误入表情字段的对白、标记主体缺失、短镜头信息过载、解剖错误和修饰词过量等质量问题。

## 案例结构

每条案例至少包含：

- `triggerType`：触发人物反应的剧情刺激。
- `primaryEmotion`：人物真实情绪。
- `secondaryEmotion`：混合或次级情绪。
- `maskEmotion`：人物试图维持的外在状态。
- `intensity`：情绪强度。
- `powerPosition`：人物在关系中的权力位置。
- `characterBaseline`：角色的常态表演基线。
- `performancePhase`：压制、释放、冻结、恢复或转变。
- `visibleAction`：可以直接交给生成模型的可见动作。
- `directorIntent`：只用于理解表演目的，不直接混入生成提示词。
- `expressionChannels`：眼神、眉部、口部、呼吸、头颈、手部和身体等泄露通道。
- `shotSize`、`durationSeconds`：镜头景别与时长。
- `qualityScore`、`qualityFlags`、`status`：质量分、问题标记和发布状态。

## 召回权重

第一版使用可解释的本地加权规则，不依赖向量数据库：

| 匹配维度 | 权重 |
| --- | ---: |
| 剧情刺激 | 25 |
| 真实情绪 | 20 |
| 面具情绪 | 15 |
| 表演阶段 | 15 |
| 人物基线 | 10 |
| 权力位置 | 10 |
| 镜头时长 | 10 |
| 镜头景别 | 10 |

真实情绪冲突会扣 10 分，压制与恢复阶段冲突会扣 12 分。锁定案例始终优先保留，并显示“用户已锁定”作为匹配原因。

## 发布门槛

只有 `published` 案例可以进入工作台召回。存在以下高风险问题时，案例自动进入 `review`：

- 短镜头承载过多连续动作。
- 描述存在明显解剖或生理错误。
- 清洗后缺少可执行的可见动作。

主体名称缺失、对白字段清理和修饰词偏多会被记录为质量标记，但不会单独阻止发布。用户通过知识摄入中心发布的 `expression_case` 词条，也会经适配器加入同一召回池。

## 数据重建

```powershell
node scripts/build-performance-examples.js "输入文件.jsonl" "data/performance-examples.js"
```

重建后执行：

```powershell
node --check scripts/build-performance-examples.js
node --check data/performance-examples.js
node --check performance-director.js
node tests/performance-director.test.js
```

生成文件使用稳定 ID、来源位置和内容指纹，便于后续替换数据源、审查重复案例及扩展到光影、镜头、动作等专业案例库。
