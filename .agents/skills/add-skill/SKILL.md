---
name: add-skill
description: 当用户发来一个或多个 GitHub 链接并要求「新增 / 收录 / 添加 skill」到 Skill 指北站点时触发。自动完成 GitHub 取数、防重、产出物分类、创作者准入判断、文案与标签撰写、JTBD 语义搜索意图扩展、SKILL.md 与演示图增量抓取、搜索索引重建、首屏预渲染及回归验收。
---

# 新增 Skill 到「Skill 指北」标准作业流程

严格按以下三步执行，**禁止跳过 `_tools/add-skill.mjs` 直接手改 `data.js`**。

## Step 1：侦察仓库事实与防重

对用户发来的所有 GitHub 链接一次性执行：

```bash
node _tools/add-skill.mjs inspect <github-url-1> [github-url-2 ...]
```

重点检查输出 JSON 中的：
- `duplicate`：若非 `null`，说明已收录，直接向用户汇报已有条目并跳过。
- `accessible` / `archived`：若 404 或已归档，先向用户确认。
- `stars` / `upstream` / `hasSkillMd` / `skillMdPreview` / `readmePreview`：阅读真实内容，不要只看仓库名臆测功能。
- `authorCheck`：按双轨克制门槛判断（轨道 A 个人创作者需 ≥ 3 仓且累计 ≥ 1,500★ / 单仓 ≥ 1,000★，或 ≥ 2 卡含大型合集；轨道 B 仅一线生态官方；**单卡爆款不占创作者坑位**）。仅当 `status === "suggest_add_author"` 或用户明确指定时才填入 `newAuthor`。

## Step 2：构造决策 JSON（核心语义工作）

参照根目录 `AGENTS.md` 中的 11 分类边界与文案规范，为每条待收录仓库整理结构化决策 JSON（支持单条对象，也支持多条数组 `[...]`）：

```json
{
  "repo": "owner/repo",
  "id": "owner-repo",
  "name": "简洁中文名（4–18 字）",
  "cat": "design|slides|diagram|video|image|writing|knowledge|intel|meta|pack|business",
  "stars": 1234,
  "upstream": ["2026-11-23", "v1.0.0", "2026-11-20"],
  "desc": "40–120 字人话描述：先说产出什么和核心机制，最后一句点明什么时候用它。中英文间保留空格。",
  "tags": ["短标签1", "短标签2", "短标签3"],
  "searchIntents": [
    "用户痛点口语词1（无多余空格）",
    "交付物/任务词2",
    "输入转输出词3",
    "细分场景词4",
    "同义说法5"
  ],
  "searchAliases": ["英文别名", "缩写", "拼音"],
  "newAuthor": null,
  "newTaxonomyTerms": []
}
```

### 语义搜索质量自查清单
1. **`searchIntents` 至少 5 条**（脚本硬门禁 ≥ 4 条）：设想普通用户**记不住这个仓库英文名**时，会在搜索框里敲什么中文痛点或口语短语。
2. **极性/风格词写明确**：如果它是「去 AI 味」「反模板」「省 Token」「透明底」「无 Mermaid」「零 API 费」这类强痛点工具，务必在 `searchIntents` 中明确写出无空格高频搜法（如 `"去AI味"`、`"省token"`）。
3. **创作者同步**：如果填入 `newAuthor`，格式为 `{ "owner": "...", "name": "中文名", "kind": "creator|official", "note": "一句话定位", "aliases": ["中文名", "拼音", "英文名"] }`。

## Step 3：原子提交与自动全链路验证

将决策 JSON 通过 stdin 或临时文件交给 `commit`（可先加 `--dry` 预检）：

```bash
node _tools/add-skill.mjs commit - <<'EOF'
<上面构造的 JSON>
EOF
```

脚本会自动完成：`data.js`（SKILLS / AUTHORS / UPS）写入与语法校验 → `seed.json` 同步 → `_tools/search-enrich.json` 与 `search-taxonomy.json` 写入 → `README.md` 统计数更新 → 增量抓取 `SKILL.md` 与演示图 → 重建 `search-index.js` → 重跑 `prerender.mjs` → 全站 34 条黄金评测（`--strict`）+ 新条目即席搜索 Top-3 验收。

## Step 4：向用户简洁汇报

完成后向用户汇报：
- 收录的 Skill 名称、分类、Star 数、是否抓取到 `SKILL.md` / 演示图、是否新增了创作者；
- 配置的语义搜索意图词及即席搜索排名验证结果。
