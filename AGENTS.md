# AGENTS.md — Skill 指北项目协作规范

本仓库是 **Skill 指北（skills.dawsondx.top）** 的源码与数据快照。核心工程铁律：

- **纯静态、零前端依赖、零构建打包工具**：站点根目录在 `site/`，所有抓取与构建脚本位于 `_tools/`（只用 Node 20+ 内置模块，不要引入 `npm install` 依赖）。
- **快照提交进仓库**：`data.js`、`demo-images.js`、`skillmd.js`、`search-index.js`、`index.html`（含预渲染首屏与 JSON-LD）全部随仓提交，确保外部服务不可用时站点照常秒开。
- **`_data/` 被 `.gitignore` 忽略**：任何需要给 GitHub Actions 构建期消费的配置（如搜索词表 `_tools/search-taxonomy.json`、搜索语义扩展 `_tools/search-enrich.json`）必须放在 `_tools/` 或 `site/` 下，不要放在 `_data/`。

---

## 核心 SOP：收到 GitHub 链接新增 / 收录 Skill

只要用户发来一个或多个 GitHub 仓库链接并要求「新增 / 收录 / 加进站里」，**严禁直接手改 `data.js` 完事**，必须走统一确定性流水线 `_tools/add-skill.mjs`（详细步骤亦封装在 `.agents/skills/add-skill/SKILL.md`）：

### Step 1：侦察仓库与作者状态（自动取数 + 防重）

```bash
node _tools/add-skill.mjs inspect <github-url> [url2 ...]
```

脚本会自动跟随重定向、校验是否已收录、抓取 Stars / 最近提交 / 版本号 / `SKILL.md` / `README.md` 摘要，并自动检查 `owner` 是否已在 `window.AUTHORS` 或满足新增创作者门槛（`authorCheck`）。

- 如果 `duplicate` 非空：告知用户该仓库已收录（报出已有 `id` 和名称），除非用户明确要求更新，否则跳过。
- 如果 `accessible: false` 或 `archived: true`：向用户说明情况后再决定是否收录。

### Step 2：由你完成高判断力语义决策（生成决策 JSON）

通读 `inspect` 返回的 `skillMdPreview` / `readmePreview`，为每条新 Skill 决定以下字段：

1. **分类 `cat`（按「最终交付物」归类，必须选以下 11 个 key 之一）**：
   - `design`：网页 / App / 小程序 UI、设计系统、落地页、网站复刻、3D/CAD 界面设计
   - `slides`：PPT / PPTX、HTML 网页幻灯片、发布会 deck、单页讲解页、飞书白板配色
   - `diagram`：架构图、流程图、技术图、UML、Excalidraw、draw.io、数据大屏、轨迹图
   - `video`：宣传片、白板手绘动画、短视频、录屏剪辑、时间线剪辑、分镜、配音 TTS、HTML 转视频
   - `image`：公众号/小红书/视频封面、正文配图、插画、海报、Logo、图标集、贴纸、透明底抠图
   - `writing`：公众号写作与排版、去 AI 味/活人感/文风、长文、写书/电子书、公文、小红书图文运营、爆款选题、标题、小说
   - `knowledge`：文档格式转换（PDF/Word/网页转 MD）、思维/人物/内容蒸馏、拆书/读论文、持久记忆、知识库/Obsidian、代码知识图谱
   - `intel`：全网热点/热榜、舆情监控、社媒跨平台读取、RSS、浏览器联网抓取、知识星球/OpenCLI
   - `meta`：给 Agent 自身用的工具链（省 Token、Skill 进化/管理/打磨、多 Agent 编排、Git 提交/代码审查、浏览器/桌面自动化、飞书/企微 CLI、提示词、安全逆向）
   - `pack`：包含多个跨场景 Skill 的合集仓库、Awesome 策展目录、官方插件/技能总包
   - `business`：求职简历、产品经理 PRD、商业诊断/行研/咨询、营销 SEO、创业、价值投资/金融、Excel/问卷分析、专利交底书

2. **文案与标签规范**：
   - `name`：简洁清晰的中文（或中英混排）短名，4–18 字。
   - `desc`：**40–120 字人话描述**。句式遵循本站编辑部语感：**先说清楚它产出什么/核心机制，最后一句点明「什么时候用它」**；客观克制，不写营销夸大词；中英文之间保留标准空格（如 `去 AI 味`、`省 Token`、`原生 PPTX`）。
   - `tags`：**恰好 3 个**高信息量短标签（每条 2–8 字）。

3. **作者判断（`newAuthor`，严格双轨克制门槛，保持下拉展柜 15–25 位高纯度）**：
   - 看 `inspect` 输出的 `authorCheck.status`：
     - `already_listed`：置 `null`。
     - `suggest_add_author`（命中以下双轨之一）：
       - **轨道 A（个人创作者 `creator`）**：必须「多产 + 口碑」双达标 —— 站内独立仓库 **≥ 3 个**（或站内卡片 ≥ 2 张且含 ≥ 15 子技能的大型原创合集）**且** 站内累计 Star **≥ 1,500**（或单仓 ≥ 1,000）。**严禁因单仓高星（哪怕 10 万+ Star）把 1 张卡的爆款单品作者塞进创作者筛选栏。**
       - **轨道 B（一级生态官方 `official`）**：仅限 AI / 开发 / 办公生态一线官方组织（如 Anthropic、Microsoft、Vercel、Google、飞书等），普通小团队 GitHub Org 不算官方。
       - 若判断确实具辨识度且能用一句话写清招牌方向，填入 `{ owner, name, kind: "creator"|"official", note, aliases: [...] }`；否则置 `null`。
     - `skip`：默认置 `null`（除非用户明确点名指定纳入某位创作者）。

4. **语义搜索匹配（必填，核心要求）**：
   - `searchIntents`：**至少 4 条、推荐 5–8 条**用户真实会搜的痛点/场景/口语短语（覆盖痛点症状、交付物、原材料→目标转换；**不加多余空格**，如 `"去AI味"`, `"做PPT"`, `"PDF转Markdown"`, `"小红书封面"`）。
   - `searchAliases`：**2–6 条**中英文别名、缩写、社区黑话、常见拼音（如 `"humanizer"`, `"xhs"`, `"gzh"`, `"quaiwei"`）。
   - `newTaxonomyTerms`（可选）：如果新 Skill 带来了某个高频同义口语说法尚未收录在 `_tools/search-taxonomy.json` 对应概念中，补充 `[{ "conceptId": "...", "terms": ["..."] }]`。

### Step 3：原子提交与全链路自动验证

将决策 JSON 通过临时文件或 stdin 传给 `commit`：

```bash
node _tools/add-skill.mjs commit - <<'EOF'
{
  "repo": "owner/repo",
  "id": "owner-repo",
  "name": "中文短名",
  "cat": "writing",
  "desc": "一句话说清产出物与核心机制。适合什么场景时用它。",
  "tags": ["标签1", "标签2", "标签3"],
  "searchIntents": ["用户痛点词1", "场景词2", "交付物词3", "口语搜法4"],
  "searchAliases": ["alias1", "pinyin1"]
}
EOF
```

`commit` 会自动完成并验证全部步骤（任一步报错自动回滚核心文件）：
1. 校验全部字段（含强制 `searchIntents >= 4`）；
2. 写入 `site/assets/js/data.js`（`SKILLS` / `AUTHORS` / `UPS`）并语法自检；
3. 同步 `site/server/seed.json`、`_tools/search-enrich.json`、`_tools/search-taxonomy.json`、`README.md` 计数；
4. 单条安全增量抓取 `SKILL.md` / README 与演示图；
5. 重建离线语义索引 `site/assets/js/search-index.js`（含抽屉 Top-5 语义近邻）；
6. 预渲染 `site/index.html`（首屏 24 张卡 + JSON-LD + noscript）；
7. 跑全站 34 条黄金搜索评测（`eval-search.mjs --strict`）+ 新条目即席搜索 Top-3 断言。

若即席搜索断言提示某条意图词未进 Top 3，按提示补充意图词或同义词后重跑 `node _tools/build-search-index.mjs && node _tools/eval-search.mjs --strict`。

---

## 其他改动守则

- **改了 `site/assets/js/card-template.js` 或 `data.js`**：必须重跑 `node _tools/prerender.mjs`，并用 `node _tools/prerender.mjs --check` 校验。
- **改了搜索词表或引擎（`search-taxonomy.json` / `search-enrich.json` / `search-engine.js`）**：必须重跑 `node _tools/build-search-index.mjs` 与 `node _tools/eval-search.mjs --strict`。
- **局部抓取 `SKILL.md` 或演示图**：始终使用 `--ids id1,id2`（两脚本均已支持安全增量合并），避免非必要全量抓取。
