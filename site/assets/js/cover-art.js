/* 逐仓插画设计稿 —— 每一条都是针对这个仓库单独定的母题、文案、配色
   m: 母题（对应 card-template.js 里的 MOTIFS）
   字段含义：
     m        母题 key
     accent   这张卡的主色（不跟分类色走，按项目气质单独挑）
     s        外壳 0/1/2（云纸 / 淡主色底 / 密格纸），让相邻卡片不撞脸
     kicker   左上角小标（英文短词，像杂志栏目名）
     right    右上角规格（数据/版本/数量，须真实或可解释）
     t        底栏大字（这个仓库自己的说法）
     sub      底栏副标题
     其余字段按母题各自取（rows / items / bars / stages …）
   设计原则：同一分类里不出现重复母题；每张至少有一处只属于这个仓库的细节。 */
window.COVER_ART = {

  /* ══ 元技能与工具链（26） ══════════════════════════════════════ */
  'karpathy-md': {
    m: 'rules', accent: '#B23C24', s: 0, kicker: 'CLAUDE.MD', right: '12 条准则',
    t: 'LLM 编程的坑', sub: '单文件 · 装了就少犯错',
    rows: [
      ['01', '少猜，先读代码'],
      ['02', '别过度抽象', 'hl'],
      ['03', '改完就验证'],
      ['04', '不要沉默失败']
    ]
  },
  'agent-browser': {
    m: 'browser', accent: '#1D4ED8', s: 0, kicker: 'BROWSER', right: 'CLI · vercel',
    t: 'agent-browser', sub: '开页面 · 点按钮 · 抓数据',
    url: 'your-app.local/dashboard',
    acts: ['goto', 'click', 'type', 'snapshot']
  },
  'skills-cli': {
    m: 'install', accent: '#0F5F58', s: 0, kicker: 'INSTALL', right: 'npm · npx',
    t: 'npx skills add', sub: '一条命令装进宿主',
    pkgs: ['ui-ux-pro-max', 'taste-skill', 'humanizer'],
    pct: 78
  },
  'lark-cli': {
    m: 'sheet', accent: '#1B6FE0', s: 0, kicker: 'LARK BASE', right: '官方 CLI',
    t: '多维表', sub: '让 agent 直接改你的表',
    cols: ['事项', '状态', '负责人'],
    rows: [
      ['需求池', '进行中', '@我'],
      ['周报', '已完成', '@团队'],
      ['复盘', '待开始', '@我']
    ]
  },
  'self-improving': {
    m: 'memory', accent: '#7C3AED', s: 0, kicker: 'MEMORY', right: '持续累积',
    t: '越用越懂你', sub: '记录 · 复盘 · 复用',
    cards: [
      ['学到', '+3', '怎么拆长任务'],
      ['踩坑', '+1', '过度抽象的代价'],
      ['偏好', '+2', '喜欢先给结论']
    ]
  },
  'aweskill': {
    m: 'pkg', accent: '#B45309', s: 0, kicker: 'PACKAGES', right: '依赖树',
    t: 'skills.json', sub: '装多了就该管起来',
    deps: [
      ['ui-ux-pro-max', '2.15.0'],
      ['taste-skill', '1.4.2'],
      ['humanizer', '3.1.0']
    ]
  },
  'larkwing': {
    m: 'flow', accent: '#0E7490', s: 0, kicker: 'WORKFLOW', right: 'Codex skill',
    t: '固定流程', sub: '飞书上的活儿工程化',
    steps: [
      ['触发', 'cron'],
      ['同步', 'base'],
      ['入库', 'doc']
    ]
  },
  'dai-task-harness': {
    m: 'tasks', accent: '#166534', s: 0, kicker: 'HARNESS', right: '长任务',
    t: '任务清单', sub: '拆开 · 跟踪 · 收敛',
    pct: 62,
    items: [
      ['拆解需求', 1],
      ['建任务清单', 1],
      ['逐条执行', 0],
      ['回收验收', 0]
    ]
  },
  'kunchenguid-no-mistakes': {
    m: 'commit', accent: '#B4232C', s: 1, kicker: 'GIT GATE', right: 'pre-push',
    t: '过不了就别合', sub: '推之前先跑一轮 AI 校验',
    nodes: [['wip', 'ng'], ['feat', 'ok'], ['tmp', 'ok']],
    gate: 'BLOCKED', note: '临时工作区校验未通过'
  },
  'nicotine00-blinkoo-vibe-daily': {
    m: 'terminal', accent: '#3B6E8F', s: 2, kicker: 'AGENTS.MD', right: '新项目',
    t: '开工先立规矩', sub: '规则文件 · 老项目体检清单',
    shell: 'vibe', cmd: 'ls AGENTS.md .skills/',
    lines: [
      ['AGENTS.md 已载入', 'ok', '✓'],
      ['项目体检 12 项', '', '→'],
      ['缺 2 项约定', 'dim', '!']
    ]
  },
  'obra-superpowers': {
    m: 'pipeline', accent: '#4B3BA8', s: 1, kicker: 'FRAMEWORK', right: '跨工具',
    t: 'agent 怎么干活', sub: '每个环节都有对应 skill',
    stages: [
      ['需求', 'brainstorm', 'done'],
      ['设计', 'write-plan', 'done'],
      ['实现', 'execute-plan', 'now'],
      ['验证', 'verify', 'lock']
    ]
  },
  'morluto-rea': {
    m: 'layers', accent: '#7A4A2B', s: 2, kicker: 'REVERSE', right: '方法论',
    t: '一层层挖到底', sub: 'App 行为 → 原生实现',
    layers: [
      ['UI', '界面上看得见的行为'],
      ['JS', '运行时与网络请求'],
      ['NATIVE', 'so / dylib 里的实现'],
      ['PROTO', '协议与密钥握手']
    ]
  },
  'garrytan-gstack': {
    m: 'tiles', accent: '#1F6F4A', s: 0, kicker: 'gstack', right: '23 tools',
    t: '高级工程师怎么挑刺', sub: 'bug · 边界 · 安全 · UX',
    cols: 3,
    items: ['bug-hunter', 'edge-case', 'security', 'ux-review', 'perf', 'dead-code', 'types', 'api-design', 'migrations'],
    more: '+14 个有主见的工具'
  },
  'microsoft-skillopt': {
    m: 'chart', accent: '#0F6E8C', s: 1, kicker: 'OPTIMIZER', right: 'text-space',
    t: 'skill 也能被训练', sub: '像调模型一样调提示词',
    unit: '+18.4%', label: '优化前后的通过率',
    bars: [['R1', 41], ['R2', 52], ['R3', 58], ['R4', 66], ['R5', 72, 'hi']]
  },
  'steipete-agent-scripts': {
    m: 'meter', accent: '#8A5B12', s: 2, kicker: 'SCRIPTS', right: 'token',
    t: '给 skill 减肥', sub: '少塞上下文，少花钱',
    from: '1.8k', to: '420', l1: '精简前', l2: '精简后', pct: 23,
    delta: '−77% 上下文开销'
  },
  'sanyuan0704-sanyuan-skills': {
    m: 'checklist', accent: '#2D5F8B', s: 0, kicker: 'CODE REVIEW', right: '生产级',
    t: '逐项过一遍再审', sub: 'SOLID · 安全 · 性能',
    items: [
      ['SOLID 与职责边界', '8.5'],
      ['错误处理与失败路径', '7.0'],
      ['安全与注入面', '×'],
      ['性能与复杂度', '7.5']
    ]
  },
  'spacezephyr-skilldeck': {
    m: 'wall', accent: '#6B4FA8', s: 1, kicker: 'SKILLDECK', right: '100+',
    t: '技能多了就得摊开看', sub: '搜 · 分类 · 一键复制口令',
    cards: [
      ['ui-ux-pro-max', 'UI'],
      ['taste-skill', '设计'],
      ['humanizer', '写作'],
      ['agent-browser', '自动化']
    ],
    more: '100+ 张卡片，还能打包成专家'
  },
  'backtthefuture-skillmanager': {
    m: 'tree', accent: '#A24E2A', s: 2, kicker: 'SCAN', right: '可回滚',
    t: '全盘扫一遍', sub: '可视化编辑 · 自动快照',
    rows: [
      ['~/.claude/skills/', '42', 0, 'd'],
      ['ui-ux-pro-max', 'v2.1', 1, 'f'],
      ['taste-skill', 'v1.4', 1, 'f'],
      ['snapshot / 3 天前', 'restore', 0, 'd']
    ]
  },
  'straighttttt-codex-skill-refactor': {
    m: 'diff', accent: '#3E6B2E', s: 0, kicker: 'REFACTOR', right: '只读优先',
    t: '先审计，再动刀', sub: '结构 · 冗余 · 触发词',
    l: '审计前', lcut: 1,
    li: ['一个 SKILL.md 1200 行', '触发词与描述重复', '示例散落在正文里'],
    r: '重构后',
    ri: ['拆成 3 个文件', '触发词只留关键差异', '示例收进 examples/']
  },
  'wehuman01-awescholar': {
    m: 'papers', accent: '#16577A', s: 1, kicker: 'ARXIV', right: '每日',
    t: '每天扫一遍新论文', sub: '去重 · 归档 · 出清单',
    items: [
      ['Speculative decoding revisited', '11-06'],
      ['Long-context routing', '11-05'],
      ['Agent memory benchmarks', '11-03']
    ]
  },
  'oil-oil-see-skill': {
    m: 'lens', accent: '#8A3B6B', s: 2, kicker: 'VISION', right: '看图',
    t: '给纯文本模型补眼睛', sub: '图片 · 视频 · 截图',
    boxes: [[14, 20, 36, 44, '按钮'], [58, 28, 32, 42, '图表']],
    ops: ['describe', 'ocr', 'detect']
  },
  'vercel-labs-agent-skills': {
    m: 'deploy', accent: '#2A2A2A', s: 0, kicker: 'PRE-DEPLOY', right: '官方',
    t: '发之前先过一遍', sub: '部署配置 · 性能 · 可访问性',
    url: 'vercel.com/new/project',
    checks: [['构建产物检查', '✓'], ['首屏 LCP', '1.2s'], ['对比度不足', '×']]
  },
  'aws-agent-toolkit-for-aws': {
    m: 'cloud', accent: '#B45309', s: 1, kicker: 'AWS', right: 'MCP',
    t: '让 agent 真能操作云', sub: 'MCP 服务器 · skill · 插件',
    hub: 'AWS MCP',
    nodes: ['S3', 'Lambda', 'DynamoDB', 'Bedrock', 'IAM', 'CloudWatch']
  },
  'wzdavid-openclaw-desktop': {
    m: 'app', accent: '#2F6E63', s: 0, kicker: 'DESKTOP', right: '开箱',
    t: '不用再折腾环境', sub: '终端 → 桌面工作区',
    title: 'OpenClaw',
    side: ['工作区', '会话', '技能', '设置'],
    main: ['新建会话', '载入配置', '连接模型', '导出日志']
  },
  'turixai-turix-cua': {
    m: 'hotspot', accent: '#3B4B8A', s: 2, kicker: 'CUA', right: '无 API',
    t: '屏幕上点得到的都能操作', sub: '把桌面 App 当成 skill 用',
    spots: [[22, 28, '点这里'], [58, 50, '拖这里'], [38, 72, '输入']],
    app: 'WeChat',
    label: '微信 · 没有 API · 只能靠界面'
  },
  'ayghri-i-have-adhd': {
    m: 'answer', accent: '#B23C24', s: 0, kicker: 'ANSWER FIRST', right: '短',
    t: '先给答案，再给过程', sub: '结论放第一行',
    big: '能，但要先改这两处。',
    dim: ['因为改完就不用再兜底了', '另外两处我先没动，等你决定', '细节见下面第 3 节']
  },

  /* ══ 合集与目录（18） ══════════════════════════════════════════ */
  'anthropics': {
    m: 'tiles', accent: '#C2410C', s: 0, kicker: 'OFFICIAL', right: '标准参考',
    t: '官方是怎么写 skill 的', sub: '想搞懂规范就读它',
    cols: 3,
    items: ['docx', 'pdf', 'pptx', 'xlsx', 'canvas-design', 'mcp-builder', 'webapp-testing', 'artifacts', 'internal-comms']
  },
  'khazix': {
    m: 'wall', accent: '#6B2FA8', s: 1, kicker: 'KHAZIX', right: '4 个',
    t: '一套人配一套 skill', sub: '定目标 · 整理 · 写作 · 分析',
    cards: [
      ['leader', '帮你定目标'],
      ['neat-freak', '洁癖式整理'],
      ['khazix-writer', '写作'],
      ['hv-analysis', '横纵分析']
    ]
  },
  'minimax': {
    m: 'radar', accent: '#1D5FBF', s: 0, kicker: 'MINIMAX', right: '多端',
    t: '前端到 Shader 都覆盖', sub: '官方开发类 skill',
    points: '50,14 76,38 66,74 34,74 24,38',
    labels: ['前端', '全栈', 'Android', 'iOS', 'Shader']
  },
  'ljg': {
    m: 'tree', accent: '#8A2F5B', s: 2, kicker: 'LJG', right: 'org / md',
    t: '两种格式，三种编辑器', sub: 'Obsidian · VSCode · Notion',
    rows: [
      ['skills/', '18 个', 0, 'd'],
      ['org/', 'Obsidian', 1, 'd'],
      ['markdown/', 'Notion', 1, 'd'],
      ['README.org', '入口', 0, 'f']
    ]
  },
  'humanlayer': {
    m: 'pipeline', accent: '#2C5AA0', s: 0, kicker: 'RPI', right: '分阶段',
    t: '每个阶段开新会话', sub: '调研 → 设计 → 实现',
    stages: [
      ['research', '先把代码读懂', 'done'],
      ['plan', '出可确认的方案', 'done'],
      ['implement', '按方案动手', 'now'],
      ['review', '复查与收尾', 'lock']
    ]
  },
  'huashu-skills': {
    m: 'feed', accent: '#B4520F', s: 1, kicker: 'HUASHU', right: '52 个',
    t: '是目录，不是大杂烩', sub: '16 旗舰 · 14 人物 · 22 内置',
    rows: [
      ['旗舰 skill', 92, '16'],
      ['人物视角', 72, '14'],
      ['内置能力', 86, '22'],
      ['skills.json', 40, '机器可读']
    ]
  },
  'yao-open-skills': {
    m: 'checklist', accent: '#0F6B4F', s: 2, kicker: 'OPENYAO', right: '公共集',
    t: '决策与商业分析', sub: '教程 · 研究 · 读书笔记',
    items: [
      ['决策框架', '✓'],
      ['商业分析', '✓'],
      ['教程生成', '✓'],
      ['微信读书笔记', '×']
    ]
  },
  'huangshu': {
    m: 'notes', accent: '#7A5A1E', s: 0, kicker: 'HUANGSHU', right: '补充包',
    t: '规模不大，可以翻翻', sub: '当补充包用最合适',
    cards: [
      ['选题', '从热点里挑'],
      ['排版', '公众号图文'],
      ['复盘', '数据回看'],
      ['素材', '随手归档']
    ]
  },
  'jamesrochabrun': {
    m: 'outline', accent: '#3A6B7A', s: 1, kicker: 'STRUCTURE', right: '参考',
    t: '目录该怎么组织', sub: '结构清晰的合集',
    rows: [
      ['skills/', '', 0, '1'],
      ['writing/', '3 个', 1, '·'],
      ['engineering/', '5 个', 1, '·'],
      ['README.md', '索引', 0, '2']
    ]
  },
  'daliu': {
    m: 'pkg', accent: '#8B3A1E', s: 2, kicker: 'DALIU', right: '中文',
    t: 'skill-creator-cn', sub: '中文 skill 生成器 · 十步学习法',
    deps: [
      ['skill-creator-cn', '1.2.0'],
      ['ten-step-learning', '1.0.3']
    ]
  },
  'kangarooking': {
    m: 'gallery', accent: '#B03A2E', s: 0, kicker: '16 条工作流', right: '自媒体',
    t: '全是自己跑通的', sub: '建议按需挑，别整包塞',
    cols: 3,
    tiles: ['封面签名', '纸刊', '品牌', '3D', '动效站', '选题'],
    pal: ['#B03A2E', '#F2C14E', '#2B2B2B']
  },
  'binggandata-bggg-skills': {
    m: 'book', accent: '#2F5F3A', s: 1, kicker: 'BGGG', right: 'Codex',
    t: '边跑边往里放', sub: '软链到 skills 目录就能用',
    title: 'Codex Skills', sub: '工作流封装',
    chs: ['工作流', '工具封装', '脚本', '约定']
  },
  'youmind-openlab-skills': {
    m: 'app', accent: '#1F5F7A', s: 2, kicker: 'YOUMIND', right: '带发布',
    t: '提取 → 创作 → 发布', sub: '一条线走完',
    title: 'YouMind',
    side: ['提取', '创作', '学习', '发布'],
    main: ['剪藏网页与视频', '抽取结构化要点', '生成草稿', '一键发布']
  },
  'liucongg-liucong-skills': {
    m: 'chart', accent: '#6B3FA0', s: 0, kicker: 'BENCH', right: '多模型',
    t: '同题横评，看差距在哪', sub: '偏工程与出稿质量',
    unit: '7 模型', label: '同一道题的打分',
    bars: [['A', 72], ['B', 68], ['C', 81], ['D', 59], ['E', 77, 'hi']]
  },
  'anthropics-claude-plugins-official': {
    m: 'deploy', accent: '#B23C24', s: 2, kicker: 'PLUGINS', right: '官方目录',
    t: '装之前先看官方推荐', sub: '质量有底线',
    url: 'claude.com/plugins',
    checks: [['官方维护', '✓'], ['版本与兼容', '✓'], ['社区投稿', '×']]
  },
  'google-skills': {
    m: 'cloud', accent: '#1A73A8', s: 0, kicker: 'GOOGLE', right: '官方',
    t: '全家桶的正确用法', sub: 'Gemini · Workspace · Cloud',
    hub: 'Google',
    nodes: ['Gemini', 'Workspace', 'Cloud', 'Sheets', 'Drive', 'Gmail']
  },
  'karanb192-awesome-claude-skills': {
    m: 'matrix', accent: '#4A5B2E', s: 1, kicker: 'AWESOME', right: '已验证',
    t: '50 多个都实际装过', sub: '挑工具时用来交叉验证',
    x: '覆盖范围', y: '验证程度',
    quads: [['装过且能用', '50+'], ['听说过', '—'], ['写得好', '待验'], ['重复造轮子', '剔除']],
    act: 0
  },
  'mondaylabos-zhubian-skills': {
    m: 'papers', accent: '#8A4B2B', s: 2, kicker: 'EDITOR', right: '第二双眼睛',
    t: '替你拍板的主编', sub: '选题 · 改稿 · 节奏',
    items: [
      ['这个选题值不值得写', '判断'],
      ['标题能不能更准', '改稿'],
      ['发太密还是太疏', '节奏']
    ]
  },

  /* ══ 写作与内容（16） ═════════════════════════════════════════ */
  'liurun-writing': {
    m: 'page', accent: '#A8331F', s: 0, kicker: 'SCQA', right: '28 年',
    t: '商业写作的势能', sub: '8 心法 · 3 结构 · SCA++',
    title: '为什么这个行业在变', no: '01',
    blocks: [
      ['h', 'S ｜ 情境'],
      ['p', 86, 54],
      ['q', '冲突：增长停了，成本还在涨'],
      ['p', 72, 40]
    ]
  },
  'huashu-bookwriter': {
    m: 'book', accent: '#1F4E5F', s: 1, kicker: 'BLUEPRINT', right: '3 蓝图',
    t: '写一本书的骨架', sub: '章节模板 · 风格 DNA',
    title: '技术书创作系统', sub: '3 种蓝图',
    chs: ['选题与读者', '章节骨架', '风格 DNA', '质量清单']
  },
  'ai-wechat': {
    m: 'pipeline', accent: '#0F6B4F', s: 2, kicker: 'WECHAT', right: '分阶段',
    t: '一句话生成太飘', sub: '选题 → 结构 → 成稿',
    stages: [
      ['选题', '今天写什么', 'done'],
      ['结构', '先把骨架搭出来', 'done'],
      ['成稿', '按固定声口写', 'now'],
      ['校对', '去 AI 味', 'lock']
    ]
  },
  'ebook-maker': {
    m: 'outline', accent: '#7A4A9E', s: 0, kicker: 'EBOOK', right: '系列',
    t: '把系列文章攒成书', sub: '大纲 → 章节 → 排版',
    rows: [
      ['第一部分 起步', '', 0, '1'],
      ['01 为什么现在做', '', 1, '·'],
      ['02 最小可跑通', '', 1, '·'],
      ['第二部分 放大', '', 0, '2']
    ]
  },
  'huashu-report': {
    m: 'chart', accent: '#1D4E89', s: 1, kicker: 'REPORT', right: '41 份',
    t: '按机构报告的标准写', sub: '6 种原型 · 8 种图表模式',
    unit: '8 类图表', label: '从采集到排版',
    bars: [['柱', 80], ['线', 66], ['散', 52], ['热', 74, 'hi'], ['桑', 44]]
  },
  'humanizer-zh': {
    m: 'diff', accent: '#B23C24', s: 2, kicker: '去 AI 味', right: '中文',
    t: '删掉那股工整劲', sub: '不对仗 · 不升华 · 不总结',
    l: 'AI 味', lcut: 1,
    li: ['综上所述，这一趋势值得关注', '不仅提升效率，更重塑范式', '首先…其次…最后…'],
    r: '人味',
    ri: ['这事我盯了三个月', '效率是涨了，麻烦也多了', '先说个反例']
  },
  'dai-viral-topic': {
    m: 'feed', accent: '#C2410C', s: 0, kicker: 'TOPIC', right: '低粉爆款',
    t: '重点捞低粉爆款', sub: '按平台分派采集逻辑',
    rows: [
      ['小红书 · 起号选题', 88, '2.1w'],
      ['X · 最近在爆', 72, '9k'],
      ['B 站 · 赛道空白', 54, '1.4w'],
      ['YouTube · 长尾', 40, '6k']
    ]
  },
  'dai-article-daily': {
    m: 'calendar', accent: '#8A5A1E', s: 1, kicker: 'DAILY', right: 'SOP',
    t: '日更不想每天从零想', sub: '热点 → 选题 → 成稿',
    head: ['一', '二', '三', '四', '五', '六', '日'],
    cells: [
      ['1', ''], ['2', 'on'], ['3', ''], ['4', 'hi'], ['5', ''], ['6', 'on'], ['7', ''],
      ['8', ''], ['9', 'on'], ['10', 'hi'], ['11', ''], ['12', 'on'], ['13', ''], ['14', '']
    ]
  },
  'mengke-wang-xiaohongshu-ai-workbench': {
    m: 'notes', accent: '#B03A6A', s: 2, kicker: 'XHS', right: '手册+工作台',
    t: '有产品，却讲不清楚', sub: '判断靠手册，执行靠它',
    cards: [
      ['说清楚', '给谁解决什么'],
      ['拆场景', '谁在什么时刻用'],
      ['找证据', '截图与数据'],
      ['定调性', '视觉与口吻']
    ]
  },
  'wshuyi-x-article-publisher-skill': {
    m: 'terminal', accent: '#1F3A5F', s: 0, kicker: 'PUBLISH', right: 'X 长文',
    t: '一条命令发出去', sub: '表格转图 · Mermaid',
    shell: 'bash', cmd: 'md2x post.md --publish',
    lines: [
      ['解析 1 篇文章', '', '→'],
      ['表格转成图片 2 张', 'ok', '✓'],
      ['Mermaid 渲染完成', 'ok', '✓'],
      ['已发布 · 3.2k 阅读', 'ok', '✓']
    ]
  },
  'jzocb-writing-style-skill': {
    m: 'meter', accent: '#6B4FA8', s: 1, kicker: 'STYLE', right: '自学',
    t: '越改越像你', sub: '从每次改稿里提规则',
    from: '0.31', to: '0.78', l1: '第 1 稿', l2: '第 12 稿', pct: 78,
    delta: '文风相似度 0.31 → 0.78'
  },
  'zhouwei713-title-matrix': {
    m: 'matrix', accent: '#B4520F', s: 2, kicker: 'TITLE', right: '多平台',
    t: '同一篇，五种标题', sub: '诊断 · 评审 · 复盘',
    x: '平台', y: '力度',
    quads: [['公众号 · 稳', '长标题'], ['小红书 · 狠', '钩子'], ['X · 直', '一句话'], ['B 站 · 具体', '数字']],
    act: 0
  },
  'aiolosking-podcast-reflection-publisher': {
    m: 'timeline', accent: '#2F6E5F', s: 0, kicker: 'PODCAST', right: '整期',
    t: '听完再写，不总结', sub: '核对事实 · 独立立意',
    clips: [['开场', 2], ['背景', 3], ['分歧点', 4, 'hi'], ['反例', 3, 'cut'], ['收尾', 2]],
    ticks: ['0:00', '18:00', '36:00', '54:00', '72:00']
  },
  'blader-humanizer': {
    m: 'checklist', accent: '#3A4E8A', s: 1, kicker: 'HUMANIZER', right: 'EN',
    t: 'correct but useless', sub: '英文稿发出去之前先过它',
    items: [
      ['It is important to note that…', '删'],
      ['In today’s fast-paced world', '删'],
      ['具体数字与来源', '留'],
      ['第一人称经验', '留']
    ]
  },
  'regan-sun-refining-transcripts-skill': {
    m: 'chat', accent: '#8A4B1F', s: 2, kicker: 'TRANSCRIPT', right: '逐字稿',
    t: '精修成能交付的 Word', sub: '只留正文 · 时间戳 · 待核标记',
    turns: [
      ['03:12 我们先从你这边最早的起点聊起', 'l', '主持'],
      ['其实最开始是反过来的，先有客户', 'r', '嘉宾'],
      ['【待核】这个数字我记得是 40%', 'r', '嘉宾']
    ]
  },
  'kangarooking-x-growth-skills': {
    m: 'radar', accent: '#1F4E89', s: 0, kicker: 'X GROWTH', right: '15 个',
    t: '不承诺爆款，只给动作', sub: '定位 · 冷启动 · 复盘',
    points: '50,12 80,40 68,78 32,78 20,40',
    labels: ['定位', '内容', '算法', '互动', '变现']
  },

  /* ══ 知识管理与阅读（15） ═════════════════════════════════════ */
  'markitdown': {
    m: 'diff', accent: '#1F6B8A', s: 0, kicker: 'CONVERT', right: 'PDF → MD',
    t: '喂模型之前先洗干净', sub: 'Word · PPT · Excel · 图片',
    l: '原文件', lcut: 2,
    li: ['双栏排版读出来是乱的', '表格变成一堆空格', '页眉页脚混进正文'],
    r: 'Markdown',
    ri: ['标题层级完整', '| 表格 | 原样保留 |', '正文干净可直接切块']
  },
  'human-distillation': {
    m: 'feed', accent: '#7A3B8A', s: 1, kicker: 'CATALOG', right: '策展',
    t: '先扫一遍再自己动手', sub: '蒸馏某个人 / 某种思维',
    rows: [
      ['芒格 · 多元思维模型', 90, '12'],
      ['费曼 · 解释的习惯', 72, '8'],
      ['塔勒布 · 风险观', 58, '6'],
      ['乔布斯 · 取舍', 44, '5']
    ]
  },
  'ljg-xray-paper': {
    m: 'papers', accent: '#16577A', s: 2, kicker: 'X-RAY', right: '餐巾纸',
    t: '压缩成一个公式', sub: '方法和结论，不用读全文',
    items: [
      ['核心方法，压成一行', '方法'],
      ['关键假设只剩两条', '假设'],
      ['能不能复现', '结论']
    ]
  },
  'ljg-xray-book': {
    m: 'book', accent: '#8A3B2E', s: 0, kicker: '3 ROUNDS', right: '三轮',
    t: '三轮认知压缩', sub: '不是摘抄金句',
    title: '拆书', sub: '三轮压缩',
    chs: ['讲了什么', '凭什么成立', '我该怎么用']
  },
  'ljg-roundtable': {
    m: 'chat', accent: '#3A5F8A', s: 1, kicker: 'ROUNDTABLE', right: '求真',
    t: '几个角色辩一件事', sub: '不求赢，求看清楚',
    turns: [
      ['这个方案的前提不成立', 'l', '反方'],
      ['前提成立，但成本被低估了', 'r', '正方'],
      ['那就先做一个最小验证', 'l', '主持']
    ]
  },
  'kepano-obsidian-skills': {
    m: 'tree', accent: '#6B4FA8', s: 2, kicker: 'OBSIDIAN', right: '官方',
    t: '让 agent 守你的规矩', sub: '按规范读写笔记库',
    rows: [
      ['vault/', '2,140 篇', 0, 'd'],
      ['00-inbox/', '未整理', 1, 'd'],
      ['10-notes/', '按主题', 1, 'd'],
      ['templates/', '模板', 1, 'f']
    ]
  },
  'anthropics-k12-teacher-skills': {
    m: 'checklist', accent: '#1F6B4F', s: 0, kicker: 'K12', right: '教师',
    t: '备课也能拆成步骤', sub: '分层教学 · 评分量规',
    items: [
      ['单元目标对齐课标', '✓'],
      ['三层任务卡', '✓'],
      ['评分量规 4 档', '✓'],
      ['家长沟通话术', '×']
    ]
  },
  'einsia-browser-bc': {
    m: 'timeline', accent: '#8A5C1F', s: 1, kicker: 'CLONE', right: '录屏',
    t: '示范一遍比写文档快', sub: '录屏 → 可复用的行为',
    clips: [['打开后台', 2], ['登录', 1, 'cut'], ['筛选订单', 3, 'hi'], ['导出', 2]],
    ticks: ['00:00', '00:45', '01:30', '02:15', '03:00']
  },
  'liyupi-yupi-skill': {
    m: 'notes', accent: '#B23C24', s: 2, kicker: 'DISTILL', right: '一个人',
    t: '听「一个人」的意见', sub: '学习 · 面试 · AI 编程 · 简历',
    cards: [
      ['怎么学', '先做再补'],
      ['面试', '项目要讲深'],
      ['简历', '删掉形容词'],
      ['AI 编程', '别跳过基础']
    ]
  },
  'liyupi-codefather': {
    m: 'outline', accent: '#2F5F8A', s: 0, kicker: 'ROADMAP', right: '百科',
    t: '一份成体系的学习路线', sub: 'Java · 前端 · Python · C++',
    rows: [
      ['基础', '', 0, '1'],
      ['语言与数据结构', '', 1, '·'],
      ['项目实战', '', 1, '·'],
      ['进阶方向', '', 0, '2']
    ]
  },
  'hexiaofeier-baojie': {
    m: 'commit', accent: '#4A5B2E', s: 1, kicker: 'VERIFY', right: '核验',
    t: '交付前最后一道工序', sub: '证据可复核 · 图表附件对齐',
    nodes: [['资料', 'ok'], ['证据', 'ok'], ['核对', 'ok'], ['复查', 'ng']],
    gate: 'PASS', note: '4 项里有 1 项待复查'
  },
  'kingkk469-creator-distiller': {
    m: 'wall', accent: '#8A2F4A', s: 2, kicker: 'CREATOR', right: '可回源',
    t: '每个观点都能回到原视频', sub: '可答疑 · 可诊断',
    cards: [
      ['选题判断', '他的逻辑'],
      ['结构习惯', '开场→反例'],
      ['口头禅', '可模仿'],
      ['盲区', '别照抄']
    ]
  },
  'jackwener-wechat-article-to-markdown': {
    m: 'page', accent: '#1F6B4F', s: 1, kicker: 'SCRAPE', right: '干净 MD',
    t: '抓下来就是能用的稿', sub: '反检测 · 去掉广告块',
    title: '那篇竞品文章', no: 'MD',
    blocks: [
      ['h', '一、他们怎么起量'],
      ['p', 88, 52],
      ['p', 70, 44],
      ['q', '这一段值得留档']
    ]
  },
  'zeroxzhang-md2book': {
    m: 'deckgrid', accent: '#7A4A1F', s: 0, kicker: 'PDF', right: '三套主题',
    t: 'Markdown 直接出厂', sub: '智能分页 · 自动目录',
    thumbs: ['封面', '目录', '第 1 章', '第 2 章', '代码页', '版权页'], act: 0
  },
  'aiolosking-english-textbook-reader': {
    m: 'hotspot', accent: '#1F5F8A', s: 2, kicker: '点读', right: '原声',
    t: '点哪句读哪句', sub: '逐句切原声 · 跟读重复',
    spots: [[28, 30, 'Unit 3'], [54, 50, '句 2'], [26, 70, '句 3']],
    app: 'Textbook · Unit 3',
    label: '教材页 · 热区点读'
  },

  /* ══ 信息与情报（12） ════════════════════════════════════════ */
  'agent-reach': {
    m: 'tiles', accent: '#1F6B8A', s: 0, kicker: 'REACH', right: '零 API 费',
    t: '一个 CLI 读五个平台', sub: '舆情 · 选题调研',
    cols: 3,
    items: ['Twitter', 'Reddit', 'YouTube', 'B 站', '小红书', '网页']
  },
  'hot-news': {
    m: 'feed', accent: '#C2410C', s: 1, kicker: 'HOT', right: '30 分钟',
    t: '多平台实时榜单', sub: '标题 · 链接 · 评分',
    rows: [
      ['微博热搜', 94, '40'],
      ['知乎热榜', 78, '28'],
      ['B 站排行', 62, '19'],
      ['抖音热点', 50, '12']
    ]
  },
  'info-skill': {
    m: 'tree', accent: '#2F5F4A', s: 2, kicker: 'READ', right: '统一入口',
    t: '信息入口太杂', sub: '网页 · RSS · 播客 · OCR',
    rows: [
      ['feeds/', '38 个源', 0, 'd'],
      ['youtube/', '字幕', 1, 'd'],
      ['podcast/', '转写', 1, 'd'],
      ['ocr/', '截图文字', 1, 'f']
    ]
  },
  'spacezephyr-creator-buddy': {
    m: 'radar', accent: '#B03A6A', s: 0, kicker: 'CREATOR', right: '总控',
    t: '给平台名加关键词', sub: '自动分派到对应分支',
    points: '50,16 78,34 72,72 30,76 22,38',
    labels: ['小红书', '公众号', '赛道', '竞品', '选题']
  },
  'mvanhorn-last30days-skill': {
    m: 'chart', accent: '#1F4E89', s: 1, kicker: '30 DAYS', right: '加权',
    t: '最近 30 天到底什么情况', sub: '点赞投票加权 · 带原始出处',
    unit: '4 平台', label: '近 30 天讨论量',
    bars: [['RD', 82], ['X', 64], ['YT', 48], ['HN', 70, 'hi']]
  },
  'jesseovo-last30days-skill-cn': {
    m: 'calendar', accent: '#B4520F', s: 2, kicker: 'CN', right: '8 平台',
    t: '中文互联网的近 30 天', sub: '跨平台热点 · 每天一份',
    head: ['一', '二', '三', '四', '五', '六', '日'],
    cells: [
      ['1', 'hi'], ['2', 'on'], ['3', ''], ['4', 'on'], ['5', ''], ['6', ''], ['7', 'on'],
      ['8', 'hi'], ['9', ''], ['10', 'on'], ['11', ''], ['12', ''], ['13', ''], ['14', 'on']
    ]
  },
  'unnoo-zsxq-skill': {
    m: 'checklist', accent: '#1F6B8A', s: 0, kicker: 'ZSXQ', right: '官方',
    t: '星主的日常维护', sub: '巡场 · 回评 · 精华 · 日报',
    items: [
      ['巡场未回帖', '12'],
      ['评论回复', '已处理'],
      ['精华整理', '8 条'],
      ['日报海报', '×']
    ]
  },
  'netease-skills': {
    m: 'notes', accent: '#B4232C', s: 1, kicker: 'MUSIC', right: 'ncm-cli',
    t: '按你的口味选歌', sub: '红心偏好画像',
    cards: [
      ['深夜', '电子 / 氛围'],
      ['通勤', '鼓点清楚'],
      ['写稿', '无人声'],
      ['下雨', '老粤语']
    ]
  },
  'jackwener-opencli': {
    m: 'terminal', accent: '#2A2A2A', s: 2, kicker: 'OPENCLI', right: '登录态',
    t: '没有 API 也能开一条路', sub: '任意网站变 CLI',
    shell: 'cli', cmd: 'opencli bilibili search --json',
    lines: [
      ['复用已登录会话', '', '→'],
      ['抓到 20 条结果', 'ok', '✓'],
      ['输出 JSON 给 agent', 'dim', '→']
    ]
  },
  'joeseesun-qiaomu-opencli-skills': {
    m: 'pkg', accent: '#6B5A1F', s: 2, kicker: 'QWERTY', right: '现成',
    t: '不用自己拼命令', sub: 'B 站 · 知乎 · 小红书直接调',
    deps: [
      ['opencli/bilibili', 'ready'],
      ['opencli/zhihu', 'ready'],
      ['opencli/xiaohongshu', 'ready']
    ]
  },
  'zarazhangrui-follow-builders': {
    m: 'wall', accent: '#1F4E5F', s: 1, kicker: 'BUILDERS', right: '一手',
    t: '只盯真正在做东西的人', sub: '研究员 · 创始人 · 工程师',
    cards: [
      ['X 时间线', '每天扫'],
      ['播客转写', '每周'],
      ['论文与博客', '按人跟'],
      ['摘要', '去二手解读']
    ]
  },
  'alibaba-flyai-flyai-skill': {
    m: 'cloud', accent: '#C2410C', s: 2, kicker: 'FLIGGY', right: '机酒',
    t: '旅行能力接进大模型', sub: '查行程 · 比价 · 出方案',
    hub: 'FlyAI',
    nodes: ['查价', '比价', '行程', '酒店', '门票']
  },

  /* ══ 商业与产品（12） ════════════════════════════════════════ */
  'pm-skills': {
    m: 'matrix', accent: '#1F4E89', s: 0, kicker: 'PM', right: '顾问团',
    t: '先判断值不值得做', sub: 'PRD · 排序 · 路线图',
    x: '确定性', y: '价值',
    quads: [['马上做', '高 / 高'], ['先验证', '高 / 低'], ['排进季度', '中等'], ['不做', '低 / 低']],
    act: 0
  },
  'skill-productizer': {
    m: 'kpi', accent: '#B4520F', s: 1, kicker: 'MONETIZE', right: '13 种方法',
    t: '你的 skill 也能卖', sub: '扫本地已装 · 按使用频率排',
    nums: [['42', '已装 skill'], ['7', '高频使用'], ['13', '变现路径']]
  },
  'huashu-excel': {
    m: 'sheet', accent: '#1F6B4F', s: 2, kicker: 'EXCEL', right: '全流程',
    t: '数字经得起追问', sub: '体检 · 清洗 · 对账 · 交付',
    cols: ['字段', '问题', '处理'],
    rows: [
      ['金额', '混着文本', '已转数值'],
      ['日期', '三种格式', '已统一'],
      ['客户', '重复 12 条', '已去重']
    ]
  },
  'coreyhaines31-marketingskills': {
    m: 'radar', accent: '#B4232C', s: 0, kicker: 'GROWTH', right: '按岗位',
    t: '把 AI 变成一支增长团队', sub: 'CRO · 文案 · SEO · 投放',
    points: '50,12 82,36 70,76 28,76 18,36',
    labels: ['CRO', '文案', 'SEO', '投放', '邮件']
  },
  'slavingia-skills': {
    m: 'notes', accent: '#8A5C1F', s: 1, kicker: 'MINIMAL', right: '一人公司',
    t: '先收钱，别急着融资', sub: '从小做起',
    cards: [
      ['先卖', '再做产品'],
      ['定价', '别免费'],
      ['招人', '能不招就不招'],
      ['增长', '靠内容']
    ]
  },
  'deanpeters-product-manager-skills': {
    m: 'tree', accent: '#2F5F8A', s: 2, kicker: '46 SKILLS', right: '成体系',
    t: '从发现需求到定价', sub: 'PM 日常工作流标准化',
    rows: [
      ['发现/', '6 个', 0, 'd'],
      ['定义/', '8 个', 1, 'd'],
      ['交付/', '12 个', 1, 'd'],
      ['商业化/', '20 个', 0, 'd']
    ]
  },
  'raphaelxiao-mck-skills': {
    m: 'chart', accent: '#1F3A5F', s: 0, kicker: 'MCK', right: '行业研究',
    t: '一周摸清一个行业', sub: '拆解 · 竞争格局 · 进入判断',
    unit: '5 个维度', label: '行业拆解覆盖度',
    bars: [['规模', 86], ['格局', 72], ['链条', 64], ['壁垒', 78, 'hi']]
  },
  'anthropics-financial-services': {
    m: 'pipeline', accent: '#0F5F58', s: 1, kicker: 'FINANCE', right: '官方',
    t: '投行 · 行研 · 私募', sub: 'agent + skill + 连接器',
    stages: [
      ['取数', '财报与行情', 'done'],
      ['建模', '三表联动', 'done'],
      ['估值', '可比与 DCF', 'now'],
      ['成稿', '投资备忘', 'lock']
    ]
  },
  'kangarooking-buffett-letters-skill': {
    m: 'book', accent: '#8A5C1F', s: 2, kicker: '60 YEARS', right: '20 模块',
    t: '该追还是该跑', sub: '不是摘要，是决策工具',
    title: '致股东信', sub: '20 个判断模块',
    chs: ['护城河到底在哪', '什么价格算便宜', '什么时候该认错']
  },
  'kangarooking-poor-charlies-almanack-skill': {
    m: 'checklist', accent: '#4A3B6B', s: 0, kicker: 'MUNGER', right: '12 模块',
    t: '重要决策前跑一遍', sub: '逆向 · 能力圈 · 激励误判',
    items: [
      ['反过来想会怎么失败', '✓'],
      ['这事在不在能力圈', '✓'],
      ['激励在推谁做什么', '✓'],
      ['有没有被叙事带走', '×']
    ]
  },
  'kangarooking-no-rules-rules-skill': {
    m: 'flow', accent: '#B4232C', s: 1, kicker: 'NETFLIX', right: '10 模块',
    t: '自由与责任', sub: '该不该留「差不多够用」的人',
    steps: [
      ['密度', '高'],
      ['坦诚', '反馈'],
      ['去流程', '少审批']
    ]
  },
  'spacezephyr-pm-product-describer': {
    m: 'answer', accent: '#1F6B8A', s: 2, kicker: 'SIX DIMS', right: '首屏',
    t: '先把产品讲明白', sub: '给谁 · 解决什么 · 为什么是你',
    big: '给每天要交三份报表的人，一个不开 Excel 的出口。',
    dim: ['为什么是我们', '凭什么成立', '谁会买单']
  },

  /* ══ 演示与幻灯片（9） ═══════════════════════════════════════ */
  'ppt-as-code': {
    m: 'pipeline', accent: '#1F4E89', s: 0, kicker: 'STAGED', right: 'HTML 幻灯片',
    t: '先定结构，再出页面', sub: '逐段确认，防跑偏成长网页',
    stages: [
      ['定结构', '大纲先行', 'done'],
      ['逐段确认', '一段一停', 'done'],
      ['出幻灯片', 'HTML', 'now'],
      ['导出', 'pptx', 'lock']
    ]
  },
  'nanobanana-ppt': {
    m: 'deckimg', accent: '#B03A6A', s: 1, kicker: 'IMAGE DECK', right: '整页出图',
    t: '一眼不像模板', sub: '智能转场 · 交互播放',
    cap: '第 07 页 · 增长从哪来', lines: ['', '']
  },
  'anionex-banana-slides': {
    m: 'deckgrid', accent: '#1F6B4F', s: 2, kicker: 'TEMPLATE', right: '传模板',
    t: '传模板，一句话出整套', sub: '本体是应用，不是 skill',
    thumbs: ['封面', '现状', '问题', '方案', '数据', '收尾'], act: 2
  },
  'nicobailon-visual-explainer': {
    m: 'terminal', accent: '#2F5F8A', s: 0, kicker: 'EXPLAIN', right: 'HTML',
    t: '别甩一坨 ASCII 图', sub: '讲架构 · 审 diff · 比方案',
    shell: 'cli', cmd: 'explain ./src --diff HEAD~1',
    lines: [
      ['解析 42 个模块', '', '→'],
      ['生成架构图 1 张', 'ok', '✓'],
      ['输出可读 HTML', 'ok', '✓']
    ]
  },
  'icip-cas-pptagent': {
    m: 'slidescore', accent: '#8A3B6B', s: 1, kicker: 'REFLECT', right: '生成→自评',
    t: '先生成，再自己重做', sub: '研究框架的参考实现',
    score: '6.5',
    notes: [['结构清楚', ''], ['数据缺出处', 'bad'], ['排版偏挤', 'bad']]
  },
  'allweonedev-presentation-ai': {
    m: 'deck', accent: '#1F7A8A', s: 2, kicker: 'GAMMA 平替', right: '可改可导',
    t: '一句话出一套演示', sub: '开源自建，能改能导',
    hd: 'Q4 REVIEW', no: '03 / 12',
    bullets: ['增长来自哪三个渠道', '留存为什么掉了 4 个点', '下季度只做两件事']
  },
  'gordensun-gordensuperpptskills': {
    m: 'decklayers', accent: '#C2410C', s: 0, kicker: '3 STEPS', right: '可编辑',
    t: '好看，还能改字', sub: '图片版 → 整份可编辑',
    layers: ['底图', '文字层', '图表层'], note: '三个技能可以分开用'
  },
  'smartschoolai-ai-to-pptx': {
    m: 'deckexport', accent: '#2F4E8A', s: 1, kicker: 'EXPORT', right: '全栈开源',
    t: '在线生成，直接导 PPTX', sub: '前后端都开源',
    file: 'deck.pptx', meta: '18 页 · 4.2 MB'
  },
  'alchaincyf-huashu-slide-doubao': {
    m: 'deckcover', accent: '#B4232C', s: 2, kicker: 'SEEDREAM 5.0', right: '豆包',
    t: '一句话出一整套物料', sub: 'PPT · 头图 · 封面 · 缩略图',
    kp: 'SEEDREAM 5.0 · 视觉物料',
    ft: ['PPT', '公众号头图', 'B站封面']
  },

  /* ══ 视频与动效（9） ═════════════════════════════════════════ */
  'edison': {
    m: 'frame916', accent: '#B03A6A', s: 0, kicker: 'VERTICAL', right: '4K',
    t: '文字直接出竖版动画', sub: '口播之外的画面补充',
    rg: '9:16 · 4K'
  },
  'screen-studio-editor': {
    m: 'timeline', accent: '#1F4E89', s: 1, kicker: 'EDIT', right: '录屏',
    t: '专治停顿和口误', sub: '合并补录 · 按讲述换画面',
    clips: [['开场', 3], ['停顿', 1, 'cut'], ['口误', 1, 'cut'], ['重点', 3, 'hi'], ['收尾', 2]],
    ticks: ['00:00', '02:00', '04:00', '06:00', '08:00']
  },
  'dai-scroll-site': {
    m: 'pipeline', accent: '#8A2F5B', s: 2, kicker: 'SCROLL', right: 'image2.0',
    t: '往下滚就推进叙事', sub: '滚动位置驱动一条视频',
    stages: [
      ['铺镜头', '一条连续视频', 'done'],
      ['挂滚动', '位置映射进度', 'done'],
      ['加文案', '分段出现', 'now']
    ]
  },
  'remotion-dev-skills': {
    m: 'layers', accent: '#1F6B8A', s: 0, kicker: 'REACT', right: '官方',
    t: '用 React 写视频', sub: '组件 · 时间轴 · 渲染',
    layers: [
      ['COMPONENT', '一帧就是一个组件'],
      ['TIMELINE', 'useCurrentFrame 驱动'],
      ['RENDER', '本地或云端出片']
    ]
  },
  'liyue-aigc-seedance-2-5-video-director': {
    m: 'storyboard', accent: '#C2410C', s: 1, kicker: 'STORYBOARD', right: 'Seedance 2.5',
    t: '稳定出片，不靠手气', sub: '人物锁定 · 可续写',
    shots: [['开场', '人物锁定'], ['推进', '参考图'], ['转折', '一镜到底']]
  },
  'gnipbao-minimax-h3-video-reverse-skill': {
    m: 'diff', accent: '#3A4E8A', s: 2, kicker: 'REVERSE', right: '可纠正',
    t: '先说自己看懂了什么', sub: '再给可复制的提示词',
    l: '参考视频', lcut: 1,
    li: ['一镜到底的推镜', '冷色调，雨夜', '主体在画面左侧'],
    r: 'MiniMax 提示词',
    ri: ['slow push-in, one take', 'cold grade, rainy night', 'subject left third']
  },
  'wyuzhi-qisi-video-remix': {
    m: 'outline', accent: '#8A5C1F', s: 0, kicker: 'REMIX', right: '同款不同故事',
    t: '还你新故事和分镜表', sub: '剧本 · 分镜 · 分段提示词',
    rows: [
      ['01 开场 3s', '', 0, '·'],
      ['02 冲突 6s', '', 1, '·'],
      ['03 反转 5s', '', 1, '·'],
      ['04 收尾 3s', '', 0, '·']
    ]
  },
  'spacezephyr-map-motion': {
    m: 'route', accent: '#1F6B4F', s: 1, kicker: 'AMAP', right: 'MP4 / GIF',
    t: '让路线动起来', sub: '真实路线 · 行政边界 · 高程',
    from: '成都', to: '拉萨', dist: '2,140 km'
  },
  'kangarooking-director-skills': {
    m: 'deckgrid', accent: '#B4232C', s: 2, kicker: 'DIRECTOR', right: '系列短片',
    t: '把导演拆成可调用的步骤', sub: '创意 → 剧本 → 分镜 → 提示词',
    thumbs: ['创意', '剧本', '分镜', '提示词', '调色', '成片'], act: 1
  },

  /* ══ 图像与视觉（13） ════════════════════════════════════════ */
  'social-card': {
    m: 'gallery', accent: '#B03A6A', s: 0, kicker: '28 版式', right: '10 主题',
    t: '一次出全套配图', sub: '小红书轮播 · 21:9 · 1:1',
    cols: 2,
    tiles: ['21:9 封面', '1:1 方图', '3:4 轮播 1', '3:4 轮播 2'],
    pal: ['#B03A6A', '#F2C14E', '#2B2B2B']
  },
  'logo-generator': {
    m: 'tiles', accent: '#1F4E89', s: 1, kicker: 'LOGO', right: '多方向',
    t: '先有个能用的标识', sub: '一句话出多个方向',
    cols: 3,
    items: ['字母标', '几何标', '手写标', '双色标', '负形标', '徽章标']
  },
  'guizang-material-illustration': {
    m: 'chart', accent: '#1F6B4F', s: 2, kicker: 'EXPLAINER', right: '一张图',
    t: '一张图说清一件事', sub: '示意图 · 图表美化 · 配图',
    unit: '改前 → 改后', label: '同一组数据',
    bars: [['旧版', 38], ['去网格', 56], ['加标注', 74], ['统一色', 86, 'hi']]
  },
  'liamgvchi-gc-minimal-zine-poster': {
    m: 'poster', accent: '#2A2A2A', s: 0, kicker: 'ZINE', right: '窄栏',
    t: '安静克制的排版', sub: '留白 · 窄栏 · 克制字体',
    words: ['LESS', 'BUT', 'BETTER'],
    sm: 'zine poster · 1:1.414 · 两色'
  },
  'vividvictor-transparent-image-generator': {
    m: 'cutout', accent: '#1F7A8A', s: 1, kicker: 'CUTOUT', right: 'PNG / WebP',
    t: '贴进 PPT 不再带白底', sub: '贴纸 · 边框 · 装饰 · 水印',
    items: ['贴纸', '产品图'], label: 'alpha · color key'
  },
  's1dashu-ip-as-logo-skill': {
    m: 'marks', accent: '#B4520F', s: 2, kicker: 'MASCOT', right: '复杂度有上限',
    t: '可爱，但不幼稚', sub: '能直接印在公司物料上',
    marks: [['圆', 'c'], ['方', 's'], ['水滴', 't']]
  },
  'everettfish-ip-illustration-for-yourself': {
    m: 'swatch', accent: '#8A3B6A', s: 0, kicker: 'IP KIT', right: '成套',
    t: '从一张锚点出发', sub: '插图 · 贴纸 · 头像 · 信纸',
    cols: [['#8A3B6A', '#8A3B6A'], ['#F2C14E', '#F2C14E'], ['#2B2B2B', '#2B2B2B'], ['#F5EFE2', '#F5EFE2']],
    type: [['萌粒风 · 统一描边', 11], ['贴纸 / 头像 / 信纸 / 拍立得', 8]]
  },
  'mondaylabos-magazine-visuals': {
    m: 'page', accent: '#1F3A5F', s: 1, kicker: 'COLUMN', right: '可复用',
    t: '栏目视觉做成系统', sub: '键帽海报 · 大标题加批注',
    title: '本周值得看的三件事', no: 'VOL.26',
    blocks: [
      ['h', '01 键帽海报'],
      ['p', 84, 50],
      ['q', '批注：这套版式能复用一整季'],
      ['p', 66, 38]
    ]
  },
  'kaankiziltug-logo-design-skill': {
    m: 'checklist', accent: '#4A3B6B', s: 2, kicker: 'PROCESS', right: '整套',
    t: '先问清定位，再出图形', sub: '概念 · 字形 · 多场景',
    items: [
      ['品牌定位访谈', '✓'],
      ['概念草图 3 版', '✓'],
      ['字形与图形', '✓'],
      ['多场景应用', '×']
    ]
  },
  'alchaincyf-huashu-icon-set': {
    m: 'deckgrid', accent: '#1F6B8A', s: 0, kicker: 'ICON SET', right: '成套',
    t: '读代码定图标清单', sub: '风格锚点 · 批量生图 · 落位',
    thumbs: ['home', 'search', 'chart', 'user', 'file', 'setting'], act: 0
  },
  'ziguishian-xhs-visual-director-skill': {
    m: 'frame916', accent: '#B4232C', s: 1, kicker: 'XHS', right: '视觉导演',
    t: '先判断这条要干什么', sub: '再选风格，最后出方案',
    rg: '3:4'
  },
  'nuyoah-ai-works-nuyoah-xiezhen-prompt': {
    m: 'lens', accent: '#8A5C1F', s: 2, kicker: 'PORTRAIT', right: '可复现',
    t: '稳定复现某种质感', sub: '人物 · 场景 · 光线 · 材质',
    boxes: [[20, 12, 42, 64, '人物'], [66, 30, 26, 40, '光线']],
    ops: ['35mm', 'f1.4', 'soft light']
  },
  'regan-sun-toastmasters-vertical-infographic': {
    m: 'pipeline', accent: '#1F4E89', s: 0, kicker: 'LONG IMG', right: '竖版',
    t: '先立住内容结构', sub: '品牌规范 · 发布前校验',
    stages: [
      ['定结构', '先列要点', 'done'],
      ['套品牌', '字色与留白', 'done'],
      ['出长图', '竖版拼接', 'now'],
      ['校验', '脚本检查', 'lock']
    ]
  },

  /* ══ 设计与前端（3） ═════════════════════════════════════════ */
  'spacezephyr-design-buddy': {
    m: 'swatch', accent: '#1F3A5F', s: 0, kicker: 'SYSTEM', right: '成套',
    t: '要资产，不要单张图', sub: '品牌系统 · 图标 · 封面 · 产品图',
    cols: [['#1F3A5F', '#1F3A5F'], ['#D9553A', '#D9553A'], ['#0F5F58', '#0F5F58'], ['#F7F3EA', '#F7F3EA']],
    type: [['Brand system', 12], ['Icon / Cover / Product', 8]]
  },
  'spacezephyr-personal-site-builder': {
    m: 'app', accent: '#2F6E63', s: 1, kicker: 'PERSONAL', right: '可部署',
    t: '先定信息层级和隐私', sub: '简历 · 社交 · 作品集',
    title: '个人站',
    side: ['首页', '作品', '简历', '联系'],
    main: ['首屏一句话说清你是谁', '三个代表作', '工作经历', '公开联系方式']
  },
  'earthtojake-text-to-cad': {
    m: 'cad', accent: '#1F6B8A', s: 2, kicker: 'CAD', right: '可加工',
    t: '把想法变成能交给工厂的文件', sub: '外观件 · 结构件草图',
    w: '120 mm', h: '48 mm'
  },

  /* ══ 图表与图解（2） ═════════════════════════════════════════ */
  'excalidraw': {
    m: 'nodes', accent: '#6B4FA8', s: 2, kicker: 'EXCALIDRAW', right: '手绘风',
    t: '草稿感的技术沟通', sub: '导出的图还能接着拖',
    list: [['需求', 16, 22], ['服务', 46, 13], ['队列', 46, 54], ['存储', 78, 34], ['反馈', 19, 66]],
    links: 'M16 22 L46 13 M46 13 L46 54 M46 54 L78 34 M19 66 L46 54'
  },
  'op7418-guizang-sports-skill': {
    m: 'route', accent: '#B4520F', s: 0, kicker: 'FIT / KML', right: '轨迹',
    t: '把一次训练讲成一张图', sub: '骑行 · 跑步 · 越野',
    from: '均速 24.8', to: '爬升 860m', dist: '78.4 km'
  }
};
