# 样板「Skill 详情抽屉」设计与实现对照说明

> 研究对象：样板页 `#detailDrawer`（Google Sites 内嵌页，Tailwind 3.4.17 构建）
> 对照对象：本项目 `site/index.html#drawer` + `assets/js/app.js` 的 `openDrawer()`
> 用途：作为把样板抽屉样式与功能迁移到本项目的依据。
> 数据来源：源码静态阅读 + 浏览器实测（Playwright，1440/1024/768/390 四档 + 暗色 + 点击路径）。
> **实施状态：P1–P4 已于 2026-11-07 全部落地，见文末 §11。**

---

## 0. 结论先行

样板抽屉是**「一张贴在纸上的卡片」式侧滑面板**，核心不是花哨动效，而是三件事：

1. **三段式骨架**：固定头（63px）+ 可滚正文（24px 内边距）+ 固定尾（65px）。头尾常驻，只有正文滚动 —— 这是它读起来「像一个详情页而不是一个弹层」的根本原因。
2. **内容分两层**：首屏给「是什么」（标题/星标/仓库/效果图），再往下给「怎么用」（tab 切换说明书 / SKILL.md 源码）。**效果图框**是整个抽屉唯一的高饱和信息块，用来兜住视线。
3. **交互只做必要动作**：滑入 300ms ease-out、遮罩 200ms 先行、ESC / 点遮罩关闭、替代方案原地换内容。
4. **12 次点击 = 同一个抽屉**：样板只有 12 条样本数据、6 种预览实现（另外 6 个仓库共用一张兜底图）。差异全在数据填充，不在组件 —— 详见 §6.0。

同时它有一批**明显没做完的边界**（背景不锁滚动、无焦点管理、深链只写不读、不响应 `prefers-reduced-motion`、字段缺失无回落）。迁移时应当「抄结构、抄节奏、抄信息层级，但不抄这些洞」。

**视觉对照（左：样板 · 右：本项目按 §9 迁移后，均为 1440 视口下的抽屉裁切）**

![样板和本项目抽屉并排对照](img/drawer-compare.webp)

迁移前两者的差距不在配色，而在**骨架**：样板是「头 / 效果框 / tab / 尾」四段信息分层，我们原来是一张 292px 大图 + 一条长滚动流。迁移后三段骨架、效果框、子 tab、尾部 CTA 全部对齐（差异只剩我们的内容更密：上游动态面板、合集反链、同作者作品是样板没有的）。

---

## 1. 结构与层级

```
┌─ #drawerBackdrop  z-40  bg-black/40 + blur(2px)  opacity 0↔1
└─ #detailDrawer    z-50  fixed right  max-w-xl(576)  100% 高   flex-col
   ├─ ① 头部  px-6 py-4  border-b  bg-paper-bg/60
   │    ├─ 左组（min-w-0）：分类胶囊 · 版本(mono) · "· 昨天更新"
   │    └─ 右组（shrink-0）：[复制分享链接] [×]
   ├─ ② 正文  flex-1  overflow-y-auto  p-6  space-y-6
   │    ├─ 标题行：h2(24/32) + ★星标胶囊(右)
   │    ├─ owner/repo（mono 12）
   │    ├─ 效果图框：外哑光面板(p-3, r16, inset 底) → 内白卡(r12)
   │    │              └─ 说明条(10px mono: LIVE OUTPUT PREVIEW / 16:10 GALLERY MATTE)
   │    │              └─ 画布 h-52(208px)
   │    ├─ 子标签页（2 个）：功能说明书与安装 ｜ SKILL.md 源码透视
   │    ├─ [Tab1] 描述 → 标签 → 安装块 → 宿主兼容矩阵(2/4 列) → 同类替代(1/2 列)
   │    └─ [Tab2] SKILL.md：inset 底 + mono 12 + pre-wrap
   └─ ③ 尾部  px-6 py-4  border-t  bg-paper-bg/80
        └─ 创作者：xxx                [访问 GitHub 仓库 ↗]（深色实心）
```

**要点**：头部是「元数据条」，不放标题；标题在正文第一行，字号 24px 是抽屉里最大的字。这个拆分让用户滑动时头部不占地方，又能在任何滚动位置看到「这是哪个分类 / 什么版本 / 多久没更新」。

---

## 2. 尺寸与间距（实测，1440×900）

| 元素 | 实测值 | 对应 Tailwind | 备注 |
|---|---|---|---|
| 抽屉宽 | **576px** | `max-w-xl` | 视口 <576 时 `w-full`，贴左 0 |
| 抽屉高 | 900（满高） | `h-full` | 无圆角，`border-l: 1px` |
| 头部高 | **63px** | `px-6 py-4` + 1px 边 | 768 以下仍是 63；390 时因换行涨到 69 |
| 正文内边距 | **24px** | `p-6` | 四边一致 |
| 正文节间距 | **24px** | `space-y-6` | 每个一级区块之间 |
| 正文可用高 | 772 | 900−63−65 | 只有这段滚动 |
| 尾部高 | **65px** | `px-6 py-4` + 1px 边 | 与头部呼应 |
| 标题 | 24/32，700，ls −0.6px | `text-2xl tracking-tight` | |
| 仓库行 | 12px mono，mt 4px | `text-xs mt-1` | |
| 分类胶囊 | 12px，padding 2×10，圆角全 | `px-2.5 py-0.5 rounded-full` | |
| 效果图外框 | 高 264，padding 12，圆角 16 | `p-3 rounded-2xl` | 哑光底 `paper-inset` |
| 效果图画布 | **高 208** | `h-52` | 卡片里的预览是 `h-32`(128) |
| 说明条 | 10px mono，padding 6×12 | `px-3 py-1.5 text-[10px]` | 上下各 1px 边 |
| 子标签 | 高 28，下内边距 10，下边框 2 | `pb-2.5 border-b-2` | 间距 `gap-6`(24) |
| 安装块 | padding 16，圆角 12，块内行距 10 | `p-4 space-y-2.5 rounded-xl` | 命令行内 padding 14×10 |
| 宿主矩阵 | gap 8，格内 padding 12×8 | `gap-2 px-3 py-2` | 2 列 → ≥640 变 4 列 |
| 替代方案 | gap 10，格内 padding 12 | `gap-2.5 p-3` | 1 列 → ≥640 变 2 列 |

**节奏**：所有间距都落在 4 的倍数上（24 / 16 / 12 / 10 / 8 / 6），唯一例外是 10px（`space-y-2.5`）。迁移时建议直接沿用这套刻度，不要引入新的奇数。

---

## 3. 配色与字阶

样板用两套同名 token（亮 `paper-*` / 暗 `ink-*`），抽屉只换值不换结构，这是它暗色几乎零成本的原因。

| 角色 | 亮色 | 暗色 | 用在哪 |
|---|---|---|---|
| 抽屉面 | `#FDFCF9` | `#191917` | 面板底（比页面底 `#F6F4EE` 更亮） |
| 页面/嵌入底 | `#F6F4EE` | `#111110` | 头部/尾部 60–80% 透明叠色 |
| 哑光/凹槽 | `#EFECE4` | `#22211E` | 效果图外框、SKILL.md 容器、标签底 |
| 细边 | `#E4E0D5` | `#2B2A26` | 分区线、卡片边 |
| 强边 | `#D2CBB8` | `#3D3B35` | 抽屉左边框、安装块外框 |
| 正文 | `#191816` | `#F3F1EC` | 标题、命令 |
| 次要 | `#6E6A61` | `#9E9A90` | 描述、repo、tab 未选中 |
| 三级 | `#9C9689` | `#6E6B63` | 说明条、替代方案 repo |
| 主色 | `#C84B26` | `#E25B34` | 分类胶囊、tab 选中、复制按钮、hover 边 |
| 星标 | `amber-600` | `amber-400` | ★ 胶囊（10% 底 + 20% 边） |
| 通过态 | `emerald-600` | `emerald-400` | 「✓ 已通过 SKILL.md 规范校验」 |

**字阶**：24(标题) / 14(描述) / 12(正文小字、mono、tab) / 11(次要计数) / 10(说明条、替代方案 repo)。**没有 16px 中间档** —— 抽屉里除标题外一律 ≤14，靠粗体和颜色拉层级，不靠字号。

**本项目映射**：`--paper #FFFCF6` ↔ 抽屉面、`--paper-2` ↔ 凹槽、`--line`/`--line-2` ↔ 细边、`--ink`/`--ink-2`/`--ink-3` ↔ 三级文字、`--accent #D9553A` ↔ 主色。语义一一对应，不需要新增变量；但**我们目前抽屉底用的是 `--bg`（页面底），比卡片面更暗**，与样板「抽屉比页面更亮」的意图相反，迁移时应改为 `--paper`。

---

## 4. 动效

| 项 | 样板 | 本项目现状 | 判断 |
|---|---|---|---|
| 面板进场 | `transform .3s cubic-bezier(0,0,.2,1)`（ease-out） | `.32s cubic-bezier(.32,.72,.24,1)` | 样板的曲线前段更快，观感更"利落"；我们的更"重" |
| 面板位移 | `translate-x-full → 0`，即整宽 576 | `translateX(102%) → none` | 等价 |
| 遮罩 | `opacity .2s` | `opacity .25s` | 都做到"遮罩比面板先落定" |
| 进场触发 | 先 `remove('hidden')` → **双 rAF** → 再改 transform | 直接加 `.on` 类 | 若元素首次 `display:none`，必须双帧，否则无过渡 |
| 关闭 | 立刻加 `translate-x-full` + `opacity-0`，**250ms 后**再 `hidden` | 直接移除 `.on` | 样板的 250ms 是硬编码，比 300ms 面板早 50ms 消失 → 会看到面板最后一下"悬空"滑出 |
| 减少动效 | 不处理 | 全局 `@media (prefers-reduced-motion)` 已兜底 | **我们更好** |

实测进场曲线（1440 宽，采样 `translateX`）：

```
  0ms  576px  ├──────────── 起点（在画布外）
 65ms  515px  │  5% 时间走了 10%
156ms  181px  │ 52% 时间走了 69%   ← 前段极快
206ms   93px  │
256ms   38px  │
357ms    0px  └─ 落定（实测总时长 ≈300ms + 首帧延迟）
```

**可复用要点**：`300ms / cubic-bezier(0,0,.2,1)` 这种"快出慢收"，配合 200ms 的遮罩，是这类侧滑面板的通用最优解；关闭时用 `transitionend` 收尾，而不是拍一个 250ms 的 `setTimeout`。

---

## 5. 响应式

| 视口 | 抽屉宽 | 左边界 | 正文 padding | 宿主矩阵 | 替代方案 | 其它 |
|---|---|---|---|---|---|---|
| 1440 | 576 | 864 | 24 | 4 列 | 2 列 | — |
| 1024 | 576 | 448 | 24 | 4 列 | 2 列 | — |
| 768 | 576 | 192 | 24 | 4 列 | 2 列 | — |
| 390 | **390（满宽）** | 0 | 24 | 2 列 | **1 列** | 头部涨到 69px |

只有**两个断点**：`sm(640)` 控制内部栅格列数，`576`（`max-w-xl` 自然触发）控制"侧滑面板 → 全屏页"。

![390px 下的样板抽屉](img/proto-drawer-390.webp)

**390 实测缺陷（迁移时必修）**：

1. 头部左组不换行控制，`设计与前端` 被压成两行，`· 昨天更新` 也折行 → 头部高度从 63 涨到 69，视觉上像没排好。
2. 说明条文案过长，`LIVE OUTPUT PREVIEW · 实测产出物效果` 与 `16:10 GALLERY MATTE` 各折两行、左右错位。
3. 正文 padding 仍是 24px，窄屏下左右留白偏厚（16px 更合适）。
4. 安装命令 `truncate` 直接省略仓库名 —— 而仓库名恰恰是用户要复制的东西。

**修法**：`@media (max-width: 640px)` 里 ① 头部左组 `flex-wrap: nowrap; overflow: hidden`，分类胶囊 `white-space: nowrap`；② 头部右组只留 ×，"复制分享链接"降级为图标或收进正文；③ 正文 padding 24 → 18；④ 说明条只留左段，右段 `display:none`；⑤ 命令块允许横向滚动而不是省略。

---

## 6. 功能与状态

### 6.0 逐个 skill 核对：12 次点击打开的是同一个抽屉

样板页脚写着 `129 REPOS`，但 `SKILLS_DATA` 实际只有 **12 条**（原型样本）。
**12 次点击打开的永远是同一个 `#detailDrawer`** —— 没有 12 套 DOM，也没有 12 套样式；所有差异都是 `openSkillDrawer(id)` 对固定节点做 `textContent` / `innerHTML` 替换。所以「逐一梳理」实际要回答的是：**哪些槽位随数据变、哪些永远不变、哪些本该变却没变**。

实测逐个打开 12/12，无 JS 报错、预览画布无横向溢出：

| # | id | previewType | 版本 | 更新 | ★ | 预览签名（前 30 字） | SKILL.md 行 | 替代数 |
|---|---|---|---|---|---|---|---|---|
| 1 | ui-ux-pro-max | ui-palette | v2.15.0 | 昨天 | 29.6k | `AA+ 4.8:1 Editorial Typography…` | 10 | 2 |
| 2 | taste-skill-frontend | bento-grid | v1.9.2 | 3 天前 | 18.4k | `SPRING(0.16,1,0.3,1) Asymmetric…` | 8 | 2 |
| 3 | native-pptx-craft | slide-deck | v3.1.0 | 2 天前 | 14.2k | `Q4 利润率提升 320bps 核心归因…` | 8 | 2 |
| 4 | hyperframes-video | video-timeline | v4.0.1 | 昨天 | 22.1k | `▶ 00:04:18 / 60FPS ● REC…` | 8 | 2 |
| 5 | vercel-react-best-practices | audit-terminal | v2.4.0 | 5 天前 | 19.5k | `✓ 104 Vercel UI/UX Rules Passed…` | 8 | 2 |
| 6 | d3-narrative-charts | data-chart | v1.6.0 | 4 天前 | 9.8k | `Agent Skill 采纳率拐点 +340%…` | 8 | **1** |
| 7 | find-skills-meta | cli-meta | v5.2.0 | 今天 | 31.2k | `SKILL.md SPEC ● VERIFIED…`（兜底） | 7 | 2 |
| 8 | grill-me-architecture | grill-dialog | v1.4.0 | 1 周前 | 12.7k | `SKILL.md SPEC ● VERIFIED…`（兜底） | 7 | 2 |
| 9 | editorial-longform-writer | editorial-doc | v2.0.4 | 6 天前 | 11.5k | `SKILL.md SPEC ● VERIFIED…`（兜底） | 8 | **1** |
| 10 | svg-editorial-illustration | svg-art | v1.3.1 | 2 周前 | 8.6k | `SKILL.md SPEC ● VERIFIED…`（兜底） | 7 | **1** |
| 11 | obsidian-second-brain | memory-graph | v2.2.0 | 3 周前 | 10.3k | `SKILL.md SPEC ● VERIFIED…`（兜底） | 4 | **1** |
| 12 | superpowers-pack | bundle-pack | v3.8.0 | 5 天前 | 25.4k | `SKILL.md SPEC ● VERIFIED…`（兜底） | 4 | 2 |

**三个关键发现**

1. **声明了 12 种 `previewType`，实际只实现了 6 种。** `renderPreviewArtwork()` 的 switch 只有 `ui-palette / bento-grid / slide-deck / video-timeline / data-chart / audit-terminal`，其余 6 个全落到 `default`，显示同一张 `SKILL.md SPEC ● VERIFIED / $ npx skills add` 兜底图 —— **一半仓库的「LIVE OUTPUT PREVIEW · 实测产出物效果」是假的**。迁移时不要照搬这 6 张 SVG：本项目刚做完 135 张逐仓插画（`cover-art.js`），这一项我们已经明显领先，应改为从 `COVER_ART` 取大图版。
2. **12 条样本字段全满**（tags 一律 4 个、`skillMd` 4–10 行、version / updated / stars / repo / creator / githubUrl 全有），因此样板**完全没暴露字段缺失时的处理**：没有空态、没有 `—` 占位、没有「该仓库没有 SKILL.md」。迁到我们 294 条真实数据时必须补回落 —— 我们有大量仓库没有 Release / Tag、没有 SKILL.md、没有图。
3. **替代方案会留空洞**：规则是「同分类 OR 同创作者取前 2；只有匹配数为 0 才退化为任意 2 个」，实测 4 个仓只匹配到 1 个 → 双列栅格出现半格。我们的 `similarOf()` 固定取 3 个且总能凑满，✅ 不用改。

**槽位分类（迁移时按这张表分工）**

| 类别 | 槽位 | 说明 |
|---|---|---|
| 永远固定（12 仓一致） | 说明条文案、两个 tab 名称、`✓ 已通过 SKILL.md 规范校验`、4 个宿主绿点、footer 结构 | 纯装饰；但「已通过校验」读起来像真实数据，是**可信度陷阱** |
| 随数据变（11 槽） | 分类胶囊 / 版本 / 更新 / 标题 / ★ / repo / 描述 / 标签 / 预览画布 / 安装命令 / SKILL.md | `openSkillDrawer()` 一次性写入 |
| 间接联动 | 替代方案（同分类或同创作者）、安装命令（打开瞬间的宿主选择） | **后者不跟随后续切换**：实测切到 Cursor 后 hero 命令变成 `npx @cursor/rules add …`，抽屉命令仍是 `npx skills add …` |
| 页面级状态 | `hash #skill=<id>`、右下角 toast | 只写不读 |

此外两个 tab 没有 `aria-selected`（实测均为 `null`），选中态纯靠 className 表达，键盘用户读不出来。

### 6.1 数据绑定（打开时一次性填充）

| 抽屉位置 | 数据源字段 | 我们的对应字段 | 缺口 |
|---|---|---|---|
| 分类胶囊 | `categoryLabel` | `CAT_MAP[cat].name` | ✅ |
| 版本 | `version` | `ver` | ✅（部分仓库无 Release，样板直接显示空） |
| "· 昨天更新" | `updated` | `upd` + `days` | ✅ 我们更细（相对时间 + 绝对日期） |
| 标题 | `title` | `name` | ✅ |
| 星标 | `starsText` | `stars` | ✅ |
| 仓库行 | `repo` | `repo` + `path` | ✅ |
| 效果图 | `previewType` → 6 种内置 SVG | `img` 或 `COVER_ART[id]` | ⚠️ 我们有 135 张逐仓插画，但只按 286×139 设计 |
| 描述 | `desc` | `desc` | ✅ |
| 标签 | `tags[]` | `tags[]` | ✅ |
| 安装命令 | `getInstallCommand(repo, 当前宿主)` | `installCmd(s)` | ⚠️ 两者都不跟随宿主切换 |
| 宿主矩阵 | **写死 4 个**（Claude/Cursor/Codex/Gemini） | **无此区块** | ❌ 需新增 |
| SKILL.md | `skillMd` 字符串 | **无** | ❌ 需抓取 |
| 同类替代 | 同分类 OR 同创作者，取 2 | 标签交集 + 同分类 + log(stars) 打分取 3 | ✅ 我们的排序更合理 |
| 创作者 | `creator` | `author`（含头像/说明/作品数） | ✅ 我们信息更多 |
| GitHub | `githubUrl` | `repoUrl(s)` | ✅ |

### 6.2 交互与状态

| 交互 | 样板行为 | 状态变化 |
|---|---|---|
| 点卡片 / 榜单行 / 迷你榜 / 替代项 | `data-card-id` 与 `data-open-skill` 两套委托，统一进 `openSkillDrawer(id)` | `state.activeDrawerSkillId` 赋值；抽屉已开时**原地换内容不重播动画** |
| 关闭 | 头部 ×、点遮罩、ESC | 清 `activeDrawerSkillId`，清 hash |
| 子标签切换 | 手动改两个 tab 的 className，`hidden` 切两块 div | 无 aria，纯视觉 |
| 复制命令 / 复制分享链接 | `navigator.clipboard` + `execCommand` 兜底 | 右下角 toast 2.2s |
| 滚轮 | 正文独立滚动 | 头部/尾部不动 |
| 键盘 | `/` `D` `ESC` 三个全局快捷键 | 抽屉内无 tab 陷阱 |

**值得抄的一点**：点"同类替代"时**不关闭再打开**，只是重新填字段 —— 内容瞬时替换，抽屉保持在原位，形成"在抽屉里横向对比"的连续感。我们的 `data-open` 处理也是这个模式，✅ 一致。

### 6.3 实测边界缺陷（样板）

| # | 问题 | 实测证据 | 迁移时怎么做 |
|---|---|---|---|
| 1 | **背景不锁滚动** | 抽屉打开时 `window.scrollBy(0,400)` 生效（0→400） | 我们已 `body.style.overflow=hidden` ✅ |
| 2 | **无焦点管理** | 打开后 `document.activeElement` 仍是 `BODY` | 我们已 `focus()` 到关闭键 ✅ |
| 3 | **无 `aria-modal` / `role=dialog`** | 只有 `<aside>` | 我们已有 ✅ |
| 4 | **深链只写不读** | 打开写 `#skill=xxx`，带 `#skill=` 直接进不打开（实测 open:false） | 我们 `?open=` 双向 ✅ |
| 5 | **两套深链参数不一致** | 写入 `#skill=`，分享按钮复制 `?open=` | 统一一个参数 ✅ |
| 6 | **不响应减少动效** | `reducedMotion:reduce` 下仍是 0.3s/0.2s | 我们已有全局兜底 ✅ |
| 7 | **切 tab 丢失滚动位置** | 从 overview 底部切到 SKILL.md，`scrollTop` 被夹到 0 | 切 tab 时记住/恢复 scrollTop，或切完 `scrollTo(0)` 显式处理 |
| 8 | **安装命令不跟随宿主切换** | 抽屉开着时切 hero 的宿主 tab，命令不变 | 命令块做成响应式：监听宿主状态重渲染 |
| 9 | 关闭时遮罩早退 50ms | 250ms 隐藏 vs 300ms 面板 | 用 `transitionend` |
| 10 | 头部窄屏折行 | 390 下 63→69px | 见 §5 |

---

## 7. 与本项目逐项对照

| 维度 | 样板 | 本项目现状 | 迁移动作 |
|---|---|---|---|
| 骨架 | 头/正文/尾三段，头尾常驻 | 单滚动容器，无头尾 | **重构为三段** |
| 宽度 | 576px | 520px（`min(520px,94vw)`） | 改 576，或保留 520 但把内边距提到 24 |
| 面板底色 | 比页面更亮（surface） | 用页面底 `--bg` | 改 `--paper` |
| 顶部视觉 | 无大图，首屏是标题+效果图框 | 292px 高的 hero 大图（无图仓库占位字母） | hero 降级为"效果图框"，高度按 §2 给 208 |
| 元数据 | 头部分类/版本/更新时间 | 正文顶部一行分类 | 上移到头部条 |
| 内容分层 | 两个子 tab（说明书 / SKILL.md） | 单流，全部铺开 | 加 tab（第二 tab 需新数据） |
| 安装 | 独立块 + "✓ 规范校验" | 一行 cmd + 一条 hint | 升级成块，加校验行 |
| 宿主兼容 | 4 格矩阵 | 无 | 新增（数据可先全局默认 4 个） |
| 替代方案 | 2 个，纯文字卡 | 3 个，带缩略图 | 保留我们的（信息更强），补 hover 描边 |
| 创作者 | 仅尾部一行 | 正文 pill + 同作者作品列表 | 保留，尾部加"创作者 + CTA" |
| 主 CTA | 尾部常驻"访问 GitHub" | 正文中间按钮 | 移到尾部固定 |
| 关闭键 | 头部方形描边键 | 浮在 hero 右上角的深色胶囊 | 移到头部（与样板一致，且不压图） |
| 动效 | 300ms ease-out | 320ms 自定义曲线 | 改 300ms `cubic-bezier(0,0,.2,1)` |
| 可访问性 | 弱 | 强（dialog/aria/焦点/锁滚动/减动效） | **保留我们的** |

---

## 8. 可复用要点（可直接落地的实现）

### 8.1 三段式骨架

```css
.drawer{position:fixed;inset:0 0 0 auto;width:min(576px,100vw);display:flex;flex-direction:column;
  background:var(--paper);border-left:1px solid var(--line);box-shadow:-18px 0 60px rgba(23,19,14,.16);}
.drawer-head{flex:0 0 auto;padding:16px 24px;border-bottom:1px solid var(--line);
  display:flex;align-items:center;justify-content:space-between;gap:16px;
  background:color-mix(in srgb,var(--bg) 60%,transparent);}
.drawer-main{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:24px;}
.drawer-foot{flex:0 0 auto;padding:16px 24px;border-top:1px solid var(--line);
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  background:color-mix(in srgb,var(--bg) 80%,transparent);}
```
> `min-height:0` 必须有，否则 `flex:1` 的子项不会收缩、内部滚动会失效。

### 8.2 效果图框（哑光 + 白卡 + 说明条）

```css
.shot{padding:12px;border-radius:16px;background:var(--paper-2);border:1px solid var(--line);
  box-shadow:inset 0 1px 3px rgba(23,19,14,.06);}
.shot-in{border-radius:12px;overflow:hidden;background:var(--paper);border:1px solid var(--line);}
.shot-cap{display:flex;justify-content:space-between;padding:6px 12px;font:500 10px/1 var(--mono);
  color:var(--ink-3);border-bottom:1px solid var(--line);}
.shot-canvas{height:208px;display:grid;place-items:center;padding:16px;}
```

### 8.3 子标签（无 JS 也能读懂的状态）

```css
.dtabs{display:flex;gap:24px;border-bottom:1px solid var(--line);}
.dtab{padding-bottom:10px;border-bottom:2px solid transparent;font-size:12px;color:var(--ink-3);background:none;border-top:0;border-left:0;border-right:0;cursor:pointer;}
.dtab[aria-selected="true"]{color:var(--accent);border-bottom-color:var(--accent);font-weight:600;}
```
> 样板用 `className` 全量覆盖切状态，容易和别的类打架；用 `aria-selected` + 属性选择器更稳，也顺手补了无障碍。

### 8.4 开启时序（双帧 + 关闭用 transitionend）

```js
function open(s){
  paint(s);                       // 先填内容
  scrim.hidden = false;
  requestAnimationFrame(() => {   // 第一帧让 display 生效
    requestAnimationFrame(() => { // 第二帧才开始过渡
      scrim.classList.add('on');
      drawer.classList.add('on');
    });
  });
}
function close(){
  drawer.classList.remove('on');
  scrim.classList.remove('on');
  drawer.addEventListener('transitionend', function done(e){
    if (e.propertyName !== 'transform') return;
    drawer.removeEventListener('transitionend', done);
    scrim.hidden = true;
    restoreFocus();
  });
}
```

### 8.5 遮罩"先落定"

遮罩 200ms、面板 300ms。差值 100ms 是"稳"的来源；反过来（遮罩比面板慢）会显得拖沓。

### 8.6 字段缺失回落（样板没做，我们必须做）

样板 12 条样本字段全满，看不到空态；我们 294 条里大量仓库缺 Release / SKILL.md / 图。建议统一规则：

| 槽位 | 缺失时 | 不要 |
|---|---|---|
| 版本 | 显示 `—`，`title` 写「无 Release / Tag，以最近提交为准」 | 不要显示 `v0.0.0` |
| 更新时间 | 显示「—」并隐藏相对时间色块 | 不要显示「刚刚」 |
| 效果图 | 用 `COVER_ART[id]` 的大图版；也没有就退回字母占位 | 不要留 208px 空白 |
| SKILL.md | tab 置灰不可点 + 正文提示「该仓库未提供 SKILL.md，点此看 README」 | 不要显示空白代码块 |
| 宿主兼容 | 回落默认 4 个（npx / Claude / Cursor / Codex） | 不要对全仓一律宣称「已通过规范校验」 |
| 「✓ 规范校验」 | **改成真实字段**：有 `skillMd` 才显示，否则隐藏 | 不要写成静态装饰文案 |
| 替代方案 | 固定补足 3 个 | 不要出现半空格子 |

---

## 9. 迁移建议

### 分期

| 期 | 内容 | 依赖 |
|---|---|---|
| **P1 结构** | 三段式骨架、效果图框、头部元数据条、尾部 CTA、关闭键移到头部、面板底色改 `--paper`、动效改 300ms | 无，纯 CSS/HTML 重构 |
| **P2 内容分层** | 加子 tab（先只做「说明书」一个 tab，SKILL.md 置灰预告） | 无需新数据 |
| **P3 信息补强** | 宿主兼容矩阵、安装块加"✓ 规范校验"、替代方案补 hover 描边 | 宿主列表可先全局写死 4 个 |
| **P4 数据补全** | `skillMd` 字段（抓 README/SKILL.md 前 N 行）、抽屉版预览图 | `_tools/` 新增抓取脚本 |

### 数据缺口（P4 才需要）

1. **`skillMd`**：样板直接存字符串。我们可以从 `raw.githubusercontent.com/{repo}/HEAD/SKILL.md` 抓前 60 行，落进 `_data/`，构建时并进 `data.js`。缺失时 tab 显示"该仓库没有 SKILL.md"。
2. **抽屉版预览**：现有 `cover-art.js` 的 135 张插画按 286×139 设计，但**已经比样板强** —— 样板 12 仓只有 6 种预览、另外 6 个共用兜底图。两个放大方案 ——
   - **A（推荐）**：给 `posterHTML()` 加 `big` 参数，用同一套 DOM 放大字号/间距，避免维护第二套；
   - **B**：外层 `transform: scale(1.5)` + `transform-origin: top left`，零成本但字会略糊。
3. **兼容宿主**：样板是写死的 4 个。我们若要按仓库区分，需在 `data.js` 加 `hosts: []`；没有就回落默认 4 个。

### 不迁移的部分（保留我们的做法）

- 遮罩锁滚动、`role="dialog" aria-modal`、焦点归还、`?open=` 双向深链、`prefers-reduced-motion` 兜底 —— 这五点是样板缺的，我们已有，别改回去。
- 我们的「同作者作品」「合集反链 / 子 skill 清单」是样板没有的信息，属于本项目优势，重构时不能丢。

---

## 10. 验收清单

- [ ] 1440 / 768 / 390 三档截图，头部不折行、说明条不换行、命令块不省略仓库名
- [ ] 只有正文滚动；头部尾部在任意滚动位置可见
- [ ] 打开：遮罩 200ms 先落定，面板 300ms 落位；关闭：`transitionend` 后隐藏遮罩
- [ ] 键盘：Tab 可在抽屉内走完一圈不跑到背景；ESC 关闭后焦点回到触发卡片
- [ ] `?open=<id>` 直接访问能打开对应抽屉
- [ ] 暗色下：抽屉面、哑光框、主色、星标、通过态五项都换到 `ink-*` / `ember`
- [ ] 系统开启"减少动效"时无位移过渡
- [ ] 无图仓库的抽屉不出现 292px 空白 hero；缺 Release / SKILL.md / 图时按 §8.6 回落
- [ ] 135 个无图仓库的抽屉预览取自 `COVER_ART`，不出现「6 种模板反复用」

---

---

## 11. 实施记录（2026-11-07，P1–P4 全部完成）

| 期 | 落地内容 | 文件 |
|---|---|---|
| P1 | 三段式骨架（头 63 / 正文 24px / 尾 68）、宽 576、底色 `--paper`、动效 300ms ease-out + 遮罩 200ms、效果框、头部元数据、尾部 CTA、关闭键移到头部 | `index.html` / `style.css` |
| P2 | 两个子 tab（说明书 / 源码透视）、`aria-selected` + `role=tabpanel`、切 tab 记住各自滚动位置、禁用态 | `app.js` |
| P3 | 安装块（命令跟随宿主切换）、「✓ 已通过校验」改成真实数据驱动、4 格可点宿主矩阵、替代方案 hover 描边、同类替代固定 3 个 | `app.js` / `style.css` |
| P4 | 抓 294 仓源码、抽屉版大图、字段缺失回落、宿主联动 | `fetch-skillmd.mjs` / `skillmd*.js` / `app.js` |

**源码数据**：`_tools/fetch-skillmd.mjs` 全量命中 **291/294**（108 个真 `SKILL.md`、183 个 README 节选、3 个没有）。
- `skillmd-index.js`（8.7 KB）随首屏加载，只记 `md` / `readme` 两种类型；
- `skillmd.js`（441 KB）**按需注入**：只在第一次点开源码 tab 时动态加 `<script>`，不压首屏；
- CI 的 `refresh` 任务里跟着上游快照一起刷新，失败沿用上次（`continue-on-error`）。

**抽屉版预览**：有真图走 `object-fit: contain` 的真实截图；无真图走 `COVER_ART` 的逐仓插画，用 `transform: scale(1.55)` 把 16:10 的逻辑画布放大填满，40 多个母题的字 / 线 / 圆角等比变大且保持矢量清晰，不用维护第二套设计。

**比样板做得更实的几处**
- 「✓ 已通过 SKILL.md 规范校验」只在真有 `SKILL.md`（108 个）时出现，其余显示「以仓库 README 为准」；样板是 12 仓一律静态宣称通过。
- 宿主矩阵 4 个格子**可点**，点了会同步安装器 tab、安装器命令、抽屉命令三处；样板打开后切宿主抽屉命令不变。
- 字段缺失全部有回落：版本 `—`（title 说明无 Release）、更新时间 `—`、无源码时 tab 置灰 + 空态卡片 + GitHub 链接、无真图时用逐仓插画。
- 我们已有的 5 项优势全部保留，另加了 **Tab 焦点陷阱** 和关闭后焦点归还（找不到触发卡片时兜底到搜索框）。

**取舍**
- 效果框画布按 16:10 自适应，1440 下约 **312px 高**（样板固定 208px）。因为我们的插画本来就是 16:10，硬压到 208 会裁掉内容。
- 宿主矩阵**回落全局默认 4 个**，没有为 294 个仓库逐个编造 `hosts: []` —— 没有可靠数据源，不造数据。
- `skillmd.js` 是单文件按需注入（441 KB），没有拆成 291 个小文件：这样 `file://` 本地预览也能用，不必起服务器。

*测量脚本：`ego/sample-cards/probe.mjs`（样式）、`probe2.mjs`（响应式/暗色/交互时序）、`probe3.mjs`（动效采样/边界）、`parse-data.mjs`（12 条数据字段分布）、`probe-all.mjs`（12 仓逐一打开核对）、`probe-linkage.mjs`（宿主联动）。原始截图：`ego/drawer-shots/`。*
*实施后的验证脚本：`_data/verify-drawer*.mjs`（`_data/` 已 gitignore，仅本地用）。*
