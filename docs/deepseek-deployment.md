# 文本模型网关部署

## 架构

```text
网页工作台 -> Cloudflare Pages Function / Worker -> DeepSeek / Kimi 官方 API
```

浏览器只访问云端网关，不保存或传递任何模型 API Key。网关从 Cloudflare Secret 中读取密钥，校验请求来源、模型和输入大小后，再调用对应供应商。生产环境使用 `pages.dev`，避免中国大陆网络对 `workers.dev` 的 DNS 污染。

## 可用模型

- `deepseek-v4-flash`：日常生成，速度与成本优先。
- `deepseek-v4-pro`：复杂剧情、细节推演与高精度方案。
- `kimi-k3`：Moonshot Kimi 通用文本模型，适合提示词生成、改写和长文本理解。
- 深度思考：两种 V4 模型都可以在工作台切换“标准生成 / 深度思考”。
- DeepSeek V3：当前官方账户模型列表不再提供独立 V3，因此网页保留禁用提示，不伪装成其他模型。

## 本地开发

```powershell
cd worker
npm install
npx wrangler dev
```

本地密钥应写入 `worker/.dev.vars`，该文件已加入 `.gitignore`：

```dotenv
DEEPSEEK_API_KEY=替换为你的密钥
KIMI_API_KEY=替换为你的密钥
KIMI_BASE_URL=https://api.moonshot.cn/v1
SERPAPI_API_KEY=可选，用于光影生成器联网搜索电影静帧
BING_IMAGE_SEARCH_KEY=可选，用于光影生成器联网搜索电影静帧
BING_IMAGE_SEARCH_ENDPOINT=https://api.bing.microsoft.com/v7.0/images/search
```

不要把密钥写入 `PromptControlConfig`、`script.js`、HTML 或 Git 仓库。

## 云端部署

```powershell
cd worker
npx wrangler login
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler deploy
```

中国大陆可访问的生产网关使用 Pages Function：

```powershell
cd worker
npx wrangler pages project create prompt-control-deepseek-api --production-branch main
npx wrangler pages secret put DEEPSEEK_API_KEY --project-name prompt-control-deepseek-api
npx wrangler pages secret put KIMI_API_KEY --project-name prompt-control-deepseek-api
npm run deploy:pages
```

部署后，将网关地址写入根目录 `index.html` 的运行时配置：

```js
window.PromptControlConfig = Object.freeze({
  apiBaseUrl: "https://prompt-control-deepseek-api.pages.dev",
});
```

## 接口

- `GET /health`：检查服务状态与当前可用模型。
- `GET /api/models`：返回工作台可选择的云端模型。
- `POST /api/performance-plans`：根据剧情、角色、项目风格和召回案例生成三套人物表演方案。
- `POST /api/lighting/search-references`：根据场景图状态、剧本和需求，生成 5 个电影静帧搜索候选；配置图片搜索 Secret 后返回真实缩略图。
- `POST /api/lighting/compose-prompt`：根据用户选中的参考图、光影方向和参数强度生成最终光影提示词。

云端请求失败、超时或返回结构不合格时，网页会自动回退到本地规则生成，并在结果区显示回退原因。

## 验证

```powershell
node --check worker/src/index.mjs
node tests/deepseek-worker.test.mjs
node tests/performance-planner.test.js
```

需要用真实 API 验证时，只通过当前终端环境变量传入密钥：

```powershell
$env:DEEPSEEK_API_KEY = Read-Host "DeepSeek API Key"
node scripts/test-deepseek-gateway.mjs deepseek-v4-flash
Remove-Item Env:DEEPSEEK_API_KEY
```

## 密钥轮换

在 DeepSeek 控制台创建新密钥后执行：

```powershell
cd worker
npx wrangler secret put DEEPSEEK_API_KEY
```

Pages 项目轮换 Secret：

```powershell
cd worker
npx wrangler pages secret put DEEPSEEK_API_KEY --project-name prompt-control-deepseek-api
```

Kimi 密钥轮换：

```powershell
cd worker
npx wrangler pages secret put KIMI_API_KEY --project-name prompt-control-deepseek-api
```

光影生成器如果要显示真实电影静帧缩略图，还需要额外配置一个图片搜索服务，二选一即可：

```powershell
cd worker
npx wrangler pages secret put SERPAPI_API_KEY --project-name prompt-control-deepseek-api
```

或：

```powershell
cd worker
npx wrangler pages secret put BING_IMAGE_SEARCH_KEY --project-name prompt-control-deepseek-api
```

未配置图片搜索 Secret 时，接口仍会返回 5 个可点击的 Google 图片搜索候选链接，页面不会中断。

Secret 更新后不需要修改网页代码。旧密钥确认停用前，应先调用 `/health` 并完成一次真实生成测试。