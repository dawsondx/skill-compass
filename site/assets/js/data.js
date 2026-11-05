/* 数据源：浏览器收藏夹「优质skills」104 条 → 去重后 92 个仓库 → 合并同仓重复后 91 个条目
   元信息抓取时间：2026-10-29
   img 为已自托管的演示图（原图来自各仓库 README），空字符串表示该仓库没有可用效果图 */

window.CATS = [
  { key: 'design',    name: '设计与前端',    icon: 'layout', color: '#E2603F', desc: '做页面、出 UI、定视觉语言' },
  { key: 'slides',    name: '幻灯片与演示',  icon: 'monitor', color: '#C2410C', desc: 'PPT、网页 deck、发布会稿' },
  { key: 'diagram',   name: '图表与可视化',  icon: 'nodes', color: '#0F766E', desc: '架构图、流程图、技术图' },
  { key: 'video',     name: '视频与动效',    icon: 'play', color: '#7C3AED', desc: '宣传片、白板动画、动效' },
  { key: 'image',     name: '插画与图像',    icon: 'image', color: '#BE185D', desc: '配图、插画、海报、Logo' },
  { key: 'writing',   name: '写作与内容',    icon: 'pen', color: '#B45309', desc: '公众号、长文、书稿、去 AI 味' },
  { key: 'knowledge', name: '知识与记忆',    icon: 'archive', color: '#1D4ED8', desc: '笔记、蒸馏、文档转换、记忆' },
  { key: 'intel',     name: '情报与信息源',  icon: 'radar', color: '#0891B2', desc: '热点、RSS、跨平台读取' },
  { key: 'meta',      name: '元技能与工具链', icon: 'wrench', color: '#4B5563', desc: 'skill 的 skill：进化、省钱、编排' },
  { key: 'pack',      name: '套装与合集',    icon: 'box', color: '#7C2D12', desc: '一次装一堆，或先逛目录' },
  { key: 'business',  name: '商业与职场',    icon: 'briefcase', color: '#166534', desc: '求职、商业诊断、产品管理' }
];

/* 知名创作者 / 官方出品：只收录「多产 + 高星 + 有辨识度」三类信号叠加的发布人
   kind: creator = 个人创作者，official = 官方或大厂团队
   count = 本站收录该发布人的作品数（运行时按 repo 的 owner 现算，这里不写死，避免对不上） */
window.AUTHORS = [
  { owner: 'alchaincyf',   name: '花叔',        kind: 'creator',  color: '#C2410C', note: '设计 / 艺术动画 / 研报 / 办公自动化，全站最多产' },
  { owner: 'oil-oil',      name: '欧呦',        kind: 'creator',  color: '#0D9488', note: '自媒体全流程：写作 / 剪辑 / 封面 / 分发' },
  { owner: 'op7418',       name: '归藏',        kind: 'creator',  color: '#E2603F', note: '幻灯片、插画、去 AI 味与产品宣传片' },
  { owner: 'JimLiu',       name: '宝玉',        kind: 'creator',  color: '#B45309', note: '效率 skill 合集、本地设计、带时间线剪辑' },
  { owner: 'KKKKhazix',    name: '卡兹克',      kind: 'creator',  color: '#BE185D', note: 'AI skill 合集、热点站、活人感写作' },
  { owner: 'lijigang',     name: '李继刚',      kind: 'creator',  color: '#7C3AED', note: 'Codex 技能集，拆解与结构化思考' },
  { owner: 'mattpocock',   name: 'Matt Pocock', kind: 'creator',  color: '#0F766E', note: '工程实践 skill，全站星数第一' },
  { owner: 'thedotmack',   name: 'thedotmack',  kind: 'creator',  color: '#1D4ED8', note: 'claude-mem 持久记忆' },
  { owner: 'pbakaus',      name: 'pbakaus',     kind: 'creator',  color: '#4B5563', note: 'impeccable 设计词汇' },
  { owner: 'kangarooking', name: '袋鼠帝',      kind: 'creator',  color: '#9F1239', note: '自媒体工作流：封面 / 选题 / 视频下载 / Agent 工程，一个合集 16 个 skill' },
  { owner: 'anthropics',   name: 'Anthropic',   kind: 'official', color: '#17130E', note: '官方 skill 仓库，标准参考实现' },
  { owner: 'microsoft',    name: 'Microsoft',   kind: 'official', color: '#0891B2', note: 'MarkItDown 文档转换' },
  { owner: 'vercel-labs',  name: 'Vercel',      kind: 'official', color: '#166534', note: 'skills CLI 与浏览器自动化' },
  { owner: 'larksuite',    name: '飞书',        kind: 'official', color: '#1D4ED8', note: '飞书官方 CLI' }
];

window.SKILLS = [
  /* ---------- 设计与前端 ---------- */
  {
    id: 'ui-ux-pro-max', name: 'UI/UX Pro Max', repo: 'nextlevelbuilder/ui-ux-pro-max-skill',
    cat: 'design', stars: 142226, img: 'nextlevelbuilder~ui-ux-pro-max-skill.gif',
    desc: '给 agent 装一套跨平台设计智能：配色、间距、组件规范都现成。做网页、App、小程序界面时先上它，产出不会一眼像模板。',
    tags: ['UI 设计', '设计系统', '多平台']
  },
  {
    id: 'awesome-design-md', name: 'DESIGN.md 品牌库', repo: 'VoltAgent/awesome-design-md',
    cat: 'design', stars: 124351, img: 'VoltAgent~awesome-design-md.png',
    desc: '上百个知名产品拆解出的 DESIGN.md 设计规范。挑一份丢进项目，agent 就照着这套视觉语言做页面，不靠你反复描述风格。',
    tags: ['设计规范', '品牌风格', '参考库']
  },
  {
    id: 'taste', name: 'Taste 审美', repo: 'Leonxlnx/taste-skill',
    cat: 'design', stars: 104878, img: 'Leonxlnx~taste-skill.webp',
    desc: '先定艺术方向、找参考图，再用浏览器自检结果，而不是一上手就写通用模板页。适合对"好看"有要求但说不清要什么的场景。',
    tags: ['审美', '参考图', '视觉方向']
  },
  {
    id: 'impeccable', name: 'Impeccable 设计词汇', repo: 'pbakaus/impeccable',
    cat: 'design', stars: 93654, img: 'pbakaus~impeccable.webp',
    desc: '一套可操作的设计词汇：让 agent「更精致一点」「再大胆些」，也能让它自我评审和审计界面。解决"我知道不对但说不出哪不对"。',
    tags: ['设计评审', '交互细节', '提示词']
  },
  {
    id: 'hallmark', name: 'Hallmark 反 AI 味', repo: 'Nutlope/hallmark',
    cat: 'design', stars: 41179, img: 'Nutlope~hallmark.png',
    desc: '专治一眼假的 AI 落地页：紫渐变、大圆角、居中堆叠。做对外页面或产品官网前先过一遍。',
    tags: ['反模板', '落地页', '视觉']
  },
  {
    id: 'huashu-design', name: '花叔 Design', repo: 'alchaincyf/huashu-design',
    cat: 'design', stars: 28026, img: 'alchaincyf~huashu-design.gif',
    desc: '一句话拿回能交付的设计：网页、App 原型、可编辑 PPTX、动画、信息图。84 种带样张的风格库，先给六个候选再挑三个方向。',
    tags: ['网页设计', '原型', '风格库']
  },
  {
    id: 'interfaces-feel-better', name: '界面手感清单', repo: 'jakubkrehel/make-interfaces-feel-better',
    cat: 'design', stars: 3868, img: 'jakubkrehel~make-interfaces-feel-better.png',
    desc: '界面从"能用"到"好用"的细节清单：层级、间距、过渡、空态、加载态。适合已经能跑但总觉得糙的项目收尾。',
    tags: ['交互细节', '打磨', '前端']
  },
  {
    id: 'draw-ui', name: 'Draw UI 出设计稿', repo: 'oil-oil/draw-ui',
    cat: 'design', stars: 523, img: 'oil-oil~draw-ui.webp',
    desc: '从截图或一句话出 App、后台、游戏界面和落地页设计稿，再按需还原成可运行页面或小程序。没有设计师时的救急方案。',
    tags: ['UI 设计稿', '截图还原', '小程序']
  },

  /* ---------- 幻灯片与演示 ---------- */
  {
    id: 'ppt-master', name: 'PPT Master', repo: 'hugohe3/ppt-master',
    cat: 'slides', stars: 70515, img: 'hugohe3~ppt-master.webp',
    desc: '把文档或一个主题变成真正能编辑的原生 PPTX——形状、转场、动画都在。甲方要 .pptx 原件、还要自己改的时候用它。',
    tags: ['原生 PPTX', '文档转 PPT', '可编辑']
  },
  {
    id: 'frontend-slides', name: 'Frontend Slides', repo: 'zarazhangrui/frontend-slides',
    cat: 'slides', stars: 31514, img: 'zarazhangrui~frontend-slides.jpg',
    desc: '用前端能力做网页幻灯片，翻页、滚动、动效都自由。适合线上分享、要嵌视频或交互的演示。',
    tags: ['HTML 幻灯片', '网页演示', '动效']
  },
  {
    id: 'guizang-ppt', name: '归藏 PPT', repo: 'op7418/guizang-ppt-skill',
    cat: 'slides', stars: 28894, img: '',
    desc: 'HTML 幻灯片：杂志编辑风与瑞士网格两套排版，自带配图提示词和低功耗放映模式。想要设计感强的汇报 deck，又不想碰 PPT。',
    tags: ['HTML 幻灯片', '杂志风', '配色']
  },
  {
    id: 'dashi-ppt', name: '大师 PPT', repo: 'chuspeeism/dashi-ppt-skill',
    cat: 'slides', stars: 10150, img: 'chuspeeism~dashi-ppt-skill.gif',
    desc: '浏览器里直接改的演示稿，多套视觉主题，导出 HTML / PDF / PPTX 三种格式。适合要边讲边改的场合。',
    tags: ['浏览器编辑', '多格式导出', '主题']
  },
  {
    id: 'html-ppt', name: 'HTML PPT Studio', repo: 'lewislulu/html-ppt-skill',
    cat: 'slides', stars: 8892, img: 'lewislulu~html-ppt-skill.gif',
    desc: '24 套主题、31 种版式、20+ 动画，专做发布会级别的网页 deck。要"像网页一样能玩"的演示时选它。',
    tags: ['HTML 幻灯片', '发布会', '动画']
  },
  {
    id: 'gorden-ppt', name: 'Gorden PPT', repo: 'GordenSun/GordenPPTSkill',
    cat: 'slides', stars: 3827, img: 'GordenSun~GordenPPTSkill.jpg',
    desc: '17 套中文精修 PPTX 模板加"只改文字"的非破坏性编辑工具。不擅长排版也能出真 .pptx，版式不会被打乱。',
    tags: ['中文模板', '原生 PPTX', '模板套用']
  },
  {
    id: 'luobo-ppt', name: '萝卜 PPT', repo: 'zhouwei713/luobo-ppt',
    cat: 'slides', stars: 426, img: 'zhouwei713~luobo-ppt.gif',
    desc: '生成和美化可编辑的原生 PPT，自带"改 → 看 → 再改"的美化循环。手上已有粗糙 PPT 要救时用。',
    tags: ['原生 PPTX', '美化', '迭代']
  },
  {
    id: 'ppt-as-code', name: 'PPT as Code', repo: 'Russell-cell/PPT-as-code',
    cat: 'slides', stars: 188, img: '',
    desc: '把做 deck 拆成阶段化流程：先定结构、逐段确认，再出 HTML 幻灯片。防止一上来就跑偏成一整张长网页。',
    tags: ['流程化', 'HTML 幻灯片', '结构化']
  },

  /* ---------- 图表与可视化 ---------- */
  {
    id: 'diagram-design', name: 'Diagram Design', repo: 'cathrynlavery/diagram-design',
    cat: 'diagram', stars: 62614, img: 'cathrynlavery~diagram-design.webp',
    desc: '38 种编辑级图表版式，输出自包含 HTML + SVG，没有阴影、没有 Mermaid 味。文章配图、文档插图、汇报图都合适。',
    tags: ['SVG 图表', '编辑风', '无 Mermaid']
  },
  {
    id: 'anatomy', name: 'Anatomy 解剖插画', repo: 'wheresryan22/anatomy',
    cat: 'diagram', stars: 22299, img: 'wheresryan22~anatomy.webp',
    desc: '等距视角的机器与系统解剖插画，可加 WebGL 着色和 3D 效果。要讲清"这东西内部怎么转"时，比流程图有力。',
    tags: ['等距插画', '原理图', 'WebGL']
  },
  {
    id: 'fireworks-graph', name: 'Fireworks 技术图', repo: 'yizhiyanhua-ai/fireworks-tech-graph',
    cat: 'diagram', stars: 11878, img: 'yizhiyanhua-ai~fireworks-tech-graph.gif',
    desc: '自然语言直接出出版级 SVG + PNG 技术图，7 种风格、支持 UML 和 AI/LLM 品牌图标。架构文章配图首选。',
    tags: ['技术图', 'UML', '品牌图标']
  },
  {
    id: 'drawio', name: 'draw.io 生成器', repo: 'Agents365-ai/drawio-skill',
    cat: 'diagram', stars: 10433, img: 'Agents365-ai~drawio-skill.gif',
    desc: '自然语言、代码、Terraform、K8s、SQL 都能转 draw.io 图，带视觉自检和最多 5 轮修正。要能接着手工编辑就用它。',
    tags: ['draw.io', '代码转图', '可编辑']
  },
  {
    id: 'arch-diagram', name: '架构图生成器', repo: 'Cocoon-AI/architecture-diagram-generator',
    cat: 'diagram', stars: 7505, img: 'Cocoon-AI~architecture-diagram-generator.png',
    desc: '深色主题的系统架构图，输出独立 HTML/SVG 文件，能直接嵌进文档或 PPT。技术方案评审够用。',
    tags: ['架构图', '深色主题', 'HTML/SVG']
  },
  {
    id: 'excalidraw', name: 'Excalidraw 图表', repo: 'coleam00/excalidraw-diagram-skill',
    cat: 'diagram', stars: 5132, img: '',
    desc: '生成 Excalidraw 手绘风图表，导出的图还能在 Excalidraw 里接着拖拽编辑。适合要"草稿感"的技术沟通。',
    tags: ['Excalidraw', '手绘风', '可编辑']
  },

  /* ---------- 视频与动效 ---------- */
  {
    id: 'srt-whiteboard', name: 'SRT 白板动画', repo: 'geeklee/srt-whiteboard-animation',
    cat: 'video', stars: 5137, img: 'geeklee~srt-whiteboard-animation.gif',
    desc: '把字幕文件做成暖米黄纸张底的白板手绘动画，笔迹是流式书写而不是整段弹出。口播视频配画面用它最省事。',
    tags: ['白板动画', 'SRT 字幕', '手绘']
  },
  {
    id: 'story-handdrawn', name: '故事转手绘动画', repo: 'gnipbao/story-to-handdrawn-video',
    cat: 'video', stars: 2316, img: 'gnipbao~story-to-handdrawn-video.png',
    desc: '中文故事文案或一组有序图片，变成手绘日记漫画动画（无声 MP4 画面轨）。后面再配音就行。',
    tags: ['手绘动画', '故事', 'MP4']
  },
  {
    id: 'huashu-motion', name: '花叔 Motion', repo: 'alchaincyf/huashu-motion',
    cat: 'video', stars: 1870, img: 'alchaincyf~huashu-motion.gif',
    desc: '一键出商业级产品宣传片，会自己作曲，还能指着画面说"改这里"。开源项目发布、产品上线用。',
    tags: ['宣传片', '配乐', '可局部改']
  },
  {
    id: 'ai-promo-video', name: 'AI 宣传片工厂', repo: 'liyupi/ai-promo-video-maker',
    cat: 'video', stars: 445, img: 'liyupi~ai-promo-video-maker.gif',
    desc: '给个产品名或网址，它自己调研、出风格样图让你挑、截 4K 页面、按节拍卡点剪、配 AI 旁白，交付 4K 宣传片。',
    tags: ['宣传片', '4K', '自动剪辑']
  },
  {
    id: 'handdrawn-motion', name: '白板手绘动效', repo: 'SpaceZephyr/space-handdrawn-motion-video',
    cat: 'video', stars: 38, img: 'SpaceZephyr~space-handdrawn-motion-video.gif',
    desc: '白板手绘风格动效：手写字、马克笔线稿、贴胶带的截图和视频片段，配音对时、卡点配乐，逐帧渲染 MP4。',
    tags: ['白板动画', '配音对时', 'MP4']
  },
  {
    id: 'jit-motion', name: 'JIT Motion', repo: 'jitOffice/jit-motion',
    cat: 'video', stars: 33, img: 'jitOffice~jit-motion.png',
    desc: '产品简介一键生成单文件 HTML 宣传动画，GSAP 多场景 + 四种画幅比例，零 emoji。要能在浏览器里直接播的动效就用它。',
    tags: ['HTML 动画', 'GSAP', '单文件']
  },
  {
    id: 'edison', name: '爱迪生竖版动画', repo: 'SaSaLiurong/edison',
    cat: 'video', stars: 0, img: '',
    desc: '文字一键生成 4K 竖版（9:16）动画视频，专为短视频平台画幅设计。做口播之外的画面补充很快。',
    tags: ['竖版视频', '9:16', '4K']
  },

  /* ---------- 插画与图像 ---------- */
  {
    id: 'gpt-image-2', name: 'GPT Image 提示词库', repo: 'freestylefly/awesome-gpt-image-2',
    cat: 'image', stars: 35211, img: 'freestylefly~awesome-gpt-image-2.jpg',
    desc: '530+ 案例、20+ 套工业级模板的提示词库，还有同提示词跨版本对比。抄的是结构不是图，出图稳定性提升明显。',
    tags: ['提示词', '图像生成', '案例库']
  },
  {
    id: 'xiaohei-illustration', name: '小黑怪诞配图', repo: 'helloianneo/ian-xiaohei-illustrations',
    cat: 'image', stars: 12944, img: 'helloianneo~ian-xiaohei-illustrations.png',
    desc: '中文章节配图专用：16:9 白底手绘，少量红橙蓝批注，风格统一又带点怪。公众号长文拆分段落用。',
    tags: ['正文配图', '手绘', '公众号']
  },
  {
    id: 'social-card', name: '归藏社媒卡片', repo: 'op7418/guizang-social-card-skill',
    cat: 'image', stars: 7837, img: '',
    desc: '小红书图文轮播、公众号 21:9 封面 + 1:1 方图，28 种版式 10 套主题，单文件 HTML 直接转 PNG。一次出全套配图。',
    tags: ['小红书', '公众号封面', 'PNG']
  },
  {
    id: 'logo-generator', name: 'Logo 生成器', repo: 'op7418/logo-generator-skill',
    cat: 'image', stars: 2300, img: '',
    desc: '一句话生成 Logo 方案，出多个方向供挑选。适合项目起步阶段先有个能用的标识。',
    tags: ['Logo', '品牌', '多方案']
  },
  {
    id: 'photo-revival', name: '照片复兴', repo: 'dacnay816y62-hub/photo-revival',
    cat: 'image', stars: 601, img: 'dacnay816y62-hub~photo-revival.png',
    desc: '日常照片转成诗意白纸手绘插画。真实场景要保留轮廓、又想要手绘质感时用。',
    tags: ['图生图', '白纸手绘', '照片']
  },
  {
    id: 'design-card', name: '设计卡片', repo: 'geekjourneyx/claude-design-card',
    cat: 'image', stars: 472, img: 'geekjourneyx~claude-design-card.png',
    desc: '14 种卡片版式：平台封面、社交分享图、编辑风卡片。需要一批尺寸统一的分享图时批量出。',
    tags: ['卡片', '社交分享', '版式']
  },
  {
    id: 'orange-line', name: '橙线插画', repo: 'orange2ai/orange-line-illustration',
    cat: 'image', stars: 450, img: 'orange2ai~orange-line-illustration.png',
    desc: '纽约客式极简编辑插画：一个观点、一处强调色、大量留白。观点型文章的配图风格。',
    tags: ['编辑插画', '极简', '观点图']
  },
  {
    id: 'heytea-style', name: '喜茶风海报', repo: 'Hchen1218/heytea-style',
    cat: 'image', stars: 334, img: 'Hchen1218~heytea-style.gif',
    desc: '把普通照片做成喜茶风格海报，品牌感强、色彩干净。活动宣传、朋友圈图用得上。',
    tags: ['海报', '品牌风', '照片']
  },
  {
    id: 'punk-ip', name: '朋克 IP 配图', repo: 'adrianpunk/punk-ip-illustrations',
    cat: 'image', stars: 228, img: 'adrianpunk~punk-ip-illustrations.png',
    desc: '朋克风个人 IP 文章配图，一套人物形象反复出现，帮账号建立辨识度。',
    tags: ['个人 IP', '配图', '风格化']
  },

  /* ---------- 写作与内容 ---------- */
  {
    id: 'stop-slop', name: 'Stop Slop 去 AI 味', repo: 'hardikpandya/stop-slop',
    cat: 'writing', stars: 18444, img: '',
    desc: '删掉文章里的 AI 痕迹（英文写作）：模板腔、排比堆砌、空洞总结。英文内容定稿前过一遍。',
    tags: ['去 AI 味', '英文写作', '编辑']
  },
  {
    id: 'gzh-design', name: '公众号排版', repo: 'isjiamu/gzh-design-skill',
    cat: 'writing', stars: 4191, img: 'isjiamu~gzh-design-skill.jpg',
    desc: 'Markdown 一键排成能直接粘进公众号编辑器的 HTML，6 套主题 + 主题生成器 + 双关卡校验。省掉手工调样式。',
    tags: ['公众号排版', 'Markdown', 'HTML']
  },
  {
    id: 'wewrite', name: 'WeWrite 公众号全流程', repo: 'oaker-io/wewrite',
    cat: 'writing', stars: 3546, img: 'oaker-io~wewrite.png',
    desc: '从抓热点、写稿、排版到进微信草稿箱，一句话跑完整条内容管道。日更公众号时能省掉大半机械操作。',
    tags: ['公众号', '全流程', '草稿箱']
  },
  {
    id: 'writing-dna', name: '写作 DNA', repo: 'larashero3-dotcom/writing-dna-skill',
    cat: 'writing', stars: 2745, img: 'larashero3-dotcom~writing-dna-skill.png',
    desc: '蒸馏任意写作风格，提取成可复用的写作 DNA，之后让 AI 按这个味道写。给客户或团队统一文风时好用。',
    tags: ['风格蒸馏', '文风复刻', '内容']
  },
  {
    id: 'liurun-writing', name: '刘润写作心法', repo: 'liangdabiao/liurun-bookwriter-skills',
    cat: 'writing', stars: 284, img: '',
    desc: '把刘润 28 年商业写作经验蒸馏成 skill：8 大心法、3 种结构、SCQA 逻辑势能、SCA++ 模板、7 种 callout。写商业评论用。',
    tags: ['商业写作', '长文', '结构化']
  },
  {
    id: 'huashu-bookwriter', name: '花叔书籍创作', repo: 'ZeroxZhang/huashu-bookwriter',
    cat: 'writing', stars: 165, img: '',
    desc: '逆向花叔三本技术书的创作系统：3 种书籍蓝图、3 种章节模板、风格 DNA、质量检查清单、PDF 导出。想系统写一本技术书时用。',
    tags: ['写书', '章节模板', 'PDF']
  },
  {
    id: 'ai-wechat', name: 'AI 公众号工作流', repo: 'YuppyChen/ai-wechat',
    cat: 'writing', stars: 64, img: '',
    desc: '基于 Claude Code 的公众号写作工作流，从选题到成稿分阶段推进。比一句话生成更可控。',
    tags: ['公众号', '工作流', '分阶段']
  },
  {
    id: 'ebook-maker', name: '电子书制作', repo: 'irenerachel/ebook-maker-skill',
    cat: 'writing', stars: 51, img: '',
    desc: '电子书制作流水线：大纲 → 章节 → 排版 → 成书。把系列文章攒成一本可分发的小册子。',
    tags: ['电子书', '排版', '内容复用']
  },

  /* ---------- 知识与记忆 ---------- */
  {
    id: 'markitdown', name: 'MarkItDown', repo: 'microsoft/markitdown',
    cat: 'knowledge', stars: 192778, img: '',
    desc: '微软出的文件转 Markdown 工具：PDF、Word、PPT、Excel、图片都行。喂给模型之前的必备一步，比复制粘贴干净得多。',
    tags: ['文档转换', 'Markdown', '微软官方']
  },
  {
    id: 'claude-mem', name: 'Claude Mem 持久记忆', repo: 'thedotmack/claude-mem',
    cat: 'knowledge', stars: 104124, img: 'thedotmack~claude-mem.gif',
    desc: '跨会话持久记忆：自动记录并压缩 agent 每次做过什么，下次开新会话能接上。长期项目不用反复交代背景。',
    tags: ['记忆', '跨会话', '上下文']
  },
  {
    id: 'nuwa', name: '女娲 思维蒸馏', repo: 'alchaincyf/nuwa-skill',
    cat: 'knowledge', stars: 36676, img: '',
    desc: '蒸馏任何人的思维方式：心智模型、决策启发式、表达 DNA。想请某个高手"入驻"你的 agent，就从这开始。',
    tags: ['思维蒸馏', '人格', '决策']
  },
  {
    id: 'colleague', name: '同事 Skill', repo: 'titanwings/colleague-skill',
    cat: 'knowledge', stars: 26167, img: 'titanwings~colleague-skill.png',
    desc: '把同事或专家的思考方式蒸馏成可复用 Skill（现名 Distilly）。团队里"那个人怎么判断问题"可以留下来。',
    tags: ['思维蒸馏', '团队', '复用']
  },
  {
    id: 'memos', name: 'MemOS 记忆系统', repo: 'MemTensor/MemOS',
    cat: 'knowledge', stars: 12167, img: 'MemTensor~MemOS.png',
    desc: '给 LLM 和 Agent 用的记忆操作系统：超持久记忆、混合检索、跨任务技能复用。做需要长期记忆的应用时当基础设施。',
    tags: ['记忆层', '检索', '基础设施']
  },
  {
    id: 'cangjie', name: '仓颉 内容蒸馏', repo: 'kangarooking/cangjie-skill',
    cat: 'knowledge', stars: 11862, img: 'kangarooking~cangjie-skill.png',
    desc: '把书、长视频、播客这类高价值内容，蒸馏成一组可执行的 Agent Skills。看完成堆课程却用不上时，用它把内容变成动作。',
    tags: ['内容蒸馏', '书', '长视频']
  },
  {
    id: 'learn-materials', name: '材料转学习页', repo: 'dmoshehun-prog/learn-from-materials',
    cat: 'knowledge', stars: 1318, img: 'dmoshehun-prog~learn-from-materials.png',
    desc: '把 PDF、整本书、论文、PPT、Word 变成可追溯的学习网页：要么通读全篇做体系，要么快速抓主线，框架图、术语表、自测题、本地笔记一次出，每条结论都标着原文页码。啃长材料、做课程笔记用它。',
    tags: ['长材料', '学习网页', '可追溯']
  },
  {
    id: 'human-distillation', name: '人类蒸馏目录', repo: 'mliu98/awesome-human-distillation',
    cat: 'knowledge', stars: 758, img: '',
    desc: '人类蒸馏类 skill 的策展目录。想找"蒸馏某个人/某种思维"的现成方案，先来这里扫一遍再动手。',
    tags: ['目录', '蒸馏', '索引']
  },
  {
    id: 'markdown-proxy', name: 'URL 转 Markdown', repo: 'joeseesun/qiaomu-markdown-proxy',
    cat: 'knowledge', stars: 508, img: '',
    desc: '任意网址转成干净 Markdown，走 r.jina.ai / defuddle 代理或内置脚本。抓参考资料、存归档时省掉手工清洗。',
    tags: ['网页转 MD', '抓取', '代理']
  },
  {
    id: 'tacit-mining', name: '隐性知识挖掘', repo: 'xiaohuailabs/tacit-mining',
    cat: 'knowledge', stars: 73, img: 'xiaohuailabs~tacit-mining.jpg',
    desc: '通过结构化对话把你脑子里说不清的隐性知识挖出来，变成 AI 能用的规则。想系统整理自己的方法论时用。',
    tags: ['隐性知识', '对话', '方法论']
  },
  {
    id: 'knowledge-health', name: '知识资产体检', repo: 's2dongman/knowledge-asset-health-check',
    cat: 'knowledge', stars: 2, img: 's2dongman~knowledge-asset-health-check.png',
    desc: '纯本地、不调大模型的企业知识资产体检：查文档健康度、找出该淘汰和该补的。给知识库做年检用。',
    tags: ['知识库', '体检', '纯本地']
  },

  /* ---------- 情报与信息源 ---------- */
  {
    id: 'agent-reach', name: 'Agent Reach', repo: 'Panniantong/Agent-Reach',
    cat: 'intel', stars: 105859, img: '',
    desc: '给 agent 一副眼睛：读 Twitter、Reddit、YouTube、B 站、小红书，一个 CLI、零 API 费。做舆情和选题调研用。',
    tags: ['社媒读取', '跨平台', '零 API 费']
  },
  {
    id: 'hot-news', name: '热点速览', repo: 'orz-ai/hot_news',
    cat: 'intel', stars: 241, img: '',
    desc: '每日热点新闻 API：多平台实时榜单，约半小时刷新一次，返回标题、链接和评分。做选题雷达的原料。',
    tags: ['热点', 'API', '榜单']
  },
  {
    id: 'info-skill', name: 'Read Buddy', repo: 'zephyrwang6/info-skill',
    cat: 'intel', stars: 85, img: '',
    desc: '能读网页、RSS、YouTube、X、飞书文档、播客，还带 OCR 和 RSS 聚合。信息入口很杂时，统一成一个读取层。',
    tags: ['RSS', '网页读取', 'OCR']
  },

  /* ---------- 元技能与工具链 ---------- */
  {
    id: 'grill-me', name: 'Grill Me 拷问需求', repo: 'mattpocock/skills',
    path: 'tree/main/skills/productivity/grill-me',
    cat: 'meta', stars: 306018, img: 'mattpocock~skills.png',
    desc: '工程师日常 skill 集里的招牌：连环提问把你的模糊想法逼成清晰方案，动手前先被拷问一遍。写代码前用它，返工少很多。',
    tags: ['提问', '需求澄清', '工程实践']
  },
  {
    id: 'karpathy-md', name: 'Karpathy 编程准则', repo: 'forrestchang/andrej-karpathy-skills',
    cat: 'meta', stars: 226119, img: '',
    desc: '一份 CLAUDE.md，把 Karpathy 指出的 LLM 编程坑写成行为准则：少猜、多验证、别过度抽象。装了就少犯低级错。',
    tags: ['CLAUDE.md', '编程准则', '单文件']
  },
  {
    id: 'caveman', name: 'Caveman 省 Token', repo: 'JuliusBrussee/caveman',
    cat: 'meta', stars: 115889, img: 'JuliusBrussee~caveman.png',
    desc: '让 agent 用"原始人语"表达，砍掉约 65% 的 token 消耗。长会话、大项目省钱用，实测能明显压成本。',
    tags: ['省 Token', '成本', '代理']
  },
  {
    id: 'agent-browser', name: 'Agent Browser', repo: 'vercel-labs/agent-browser',
    cat: 'meta', stars: 44802, img: '',
    desc: 'Vercel 出的浏览器自动化 CLI，给 agent 用：开页面、点按钮、填表单、抓数据。要 agent 真的"上网操作"时的底座。',
    tags: ['浏览器自动化', 'CLI', 'Vercel']
  },
  {
    id: 'skills-cli', name: 'skills CLI', repo: 'vercel-labs/skills',
    cat: 'meta', stars: 37077, img: '',
    desc: 'skill 生态的官方命令行：一条 npx skills add 装好，支持 Claude Code、Codex、Cursor 等 75+ 工具。装任何 skill 都从这进。',
    tags: ['CLI', '安装', '生态']
  },
  {
    id: 'pua', name: 'PUA Skill', repo: 'tanweai/pua',
    cat: 'meta', stars: 19777, img: 'tanweai~pua.jpeg',
    desc: '用 KPI、PIP、"你曾经被寄予厚望"这类话术给 agent 施压，逼它交出更好的结果。情绪化提示词的一次极端实验，效果见仁见智。',
    tags: ['提示词', '施压', '实验']
  },
  {
    id: 'hermes-webui', name: 'Hermes WebUI', repo: 'nesquena/hermes-webui',
    cat: 'meta', stars: 19250, img: '',
    desc: 'Hermes Agent 的网页和手机界面，本地跑的 agent 可以随时随地用。想把 agent 从终端搬到手机上时用。',
    tags: ['WebUI', '移动端', 'Hermes']
  },
  {
    id: 'lark-cli', name: '飞书 CLI', repo: 'larksuite/cli',
    cat: 'meta', stars: 17876, img: '',
    desc: '飞书官方 CLI，人和 AI 都能操作：消息、文档、多维表这些核心能力都覆盖。让 agent 直接改你的飞书表格。',
    tags: ['飞书', '官方 CLI', '多维表']
  },
  {
    id: 'darwin', name: '达尔文 Skill 进化', repo: 'alchaincyf/darwin-skill',
    cat: 'meta', stars: 6693, img: 'alchaincyf~darwin-skill.png',
    desc: '让 skill 自我进化：评估 → 改进 → 测试 → 保留或回滚。手上的 skill 越用越差时，用它跑一轮进化。',
    tags: ['自我进化', '评估', '回滚']
  },
  {
    id: 'danghuangshang', name: '当皇上 多 Agent', repo: 'wanikua/danghuangshang',
    cat: 'meta', stars: 2713, img: 'wanikua~danghuangshang.png',
    desc: '借中国官制做角色分工的多 agent 协作系统，能接飞书。想让一队 agent 各司其职跑复杂流程时，拿它当组织模板。',
    tags: ['多 Agent', '角色分工', '飞书']
  },
  {
    id: 'luban', name: '鲁班 Skill 打磨', repo: 'LearnPrompt/luban-skill',
    cat: 'meta', stars: 962, img: '',
    desc: '把"能用的 skill"打磨成"能被装、能传播、能验证、能进化"的公共资产：验料、访行、过尺、慢刨、回炉。要发布自己的 skill 时走一遍。',
    tags: ['skill 打磨', '发布', '质量']
  },
  {
    id: 'self-improving', name: '自我改进 Agent', repo: 'peterskoett/self-improving-agent',
    cat: 'meta', stars: 782, img: '',
    desc: '自动记录学到的东西、犯过的错和新需求，让 agent 持续变得更好。适合长期养一个固定 agent 的场景。',
    tags: ['自我改进', '记录', '长期']
  },
  {
    id: 'taotie', name: '饕餮 Skill 进化器', repo: 'binggandata/bggg-skill-taotie',
    cat: 'meta', stars: 98, img: 'binggandata~bggg-skill-taotie.png',
    desc: '吞掉别的 skill、分析它们的优势，用来强化你的目标 skill。和达尔文的分工：一个向外看，一个向内改。',
    tags: ['skill 进化', '借鉴', '优化']
  },
  {
    id: 'aweskill', name: 'aweskill 包管理', repo: 'Webioinfo01/aweskill',
    cat: 'meta', stars: 36, img: '',
    desc: 'CLI 优先的 skill 包管理器，agent 能自己操作：装、更新、管依赖。skill 装多了之后需要它来收拾。',
    tags: ['包管理', 'CLI', '依赖']
  },
  {
    id: 'larkwing', name: 'Larkwing 飞书工作流', repo: 'MondayLabOS/larkwing-cli',
    cat: 'meta', stars: 1, img: '',
    desc: '把飞书 CLI 的操作工程化成 Codex skill 和自动化脚本。要在飞书上跑固定流程时，比每次手敲命令可靠。',
    tags: ['飞书', '自动化', 'Codex']
  },

  /* ---------- 套装与合集 ---------- */
  {
    id: 'anthropics', name: 'Anthropic 官方 Skills', repo: 'anthropics/skills',
    cat: 'pack', stars: 184602, img: '',
    desc: '官方 skill 仓库：docx、pdf、pptx、xlsx 等，也是 Agent Skills 标准的事实参考实现。想搞懂 skill 该怎么写就读它。',
    tags: ['官方', '文档处理', '标准参考']
  },
  {
    id: 'baoyu', name: '宝玉 Skills', repo: 'JimLiu/baoyu-skills',
    cat: 'pack', stars: 27048, img: '',
    desc: '宝玉分享的 20+ 日常效率 skill（Claude Code / Codex 通用）。作者明确提醒：按需装，全装会给 agent 加冗余上下文。',
    tags: ['中文', '效率', '20+ skill']
  },
  {
    id: 'khazix', name: '卡兹克 Skills', repo: 'KKKKhazix/khazix-skills',
    cat: 'pack', stars: 21729, img: '',
    desc: '数字生命卡兹克的开源合集：leader 帮你定目标、neat-freak 洁癖式整理、khazix-writer 写作、hv-analysis 横纵分析。',
    tags: ['中文', '写作', '分析']
  },
  {
    id: 'minimax', name: 'MiniMax Skills', repo: 'MiniMax-AI/skills',
    cat: 'pack', stars: 13742, img: '',
    desc: 'MiniMax 官方开发类 skill：前端、全栈、Android、iOS、Shader。用 MiniMax 模型写代码时配套上。',
    tags: ['官方', '开发', '多端']
  },
  {
    id: 'ljg', name: '李继刚 Skills', repo: 'lijigang/ljg-skills',
    cat: 'pack', stars: 7586, img: '',
    desc: '李继刚的 Codex 技能集，提供 org-mode 和 Markdown 两种格式，Obsidian / VSCode / Notion 用户都能用。',
    tags: ['中文', 'Obsidian', 'org-mode']
  },
  {
    id: 'sensenova', name: '商汤 SenseNova Skills', repo: 'OpenSenseNova/SenseNova-Skills',
    cat: 'pack', stars: 5955, img: 'OpenSenseNova~SenseNova-Skills.webp',
    desc: '商汤的模块化办公 skill，偏企业效率场景（会议、文档、信息处理）。企业内落地时看这套的组织方式。',
    tags: ['官方', '办公', '企业']
  },
  {
    id: 'humanlayer', name: 'HumanLayer Skills', repo: 'humanlayer/skills',
    cat: 'pack', stars: 5499, img: '',
    desc: 'HumanLayer 的工程 skill，招牌 rpi 走"调研 → 设计 → 实现"分阶段流程，默认每个阶段开新会话。适合复杂改造。',
    tags: ['工程', '分阶段', '调研']
  },
  {
    id: 'hermes-book', name: 'Hermes Agent 橙皮书', repo: 'alchaincyf/hermes-agent-orange-book',
    cat: 'pack', stars: 5034, img: '',
    desc: 'Hermes Agent 从入门到精通的橙皮书教程，注意这是学习资料不是 skill 包。要上手 Hermes 框架先读它。',
    tags: ['教程', '橙皮书', 'Hermes']
  },
  {
    id: 'huashu-skills', name: '花叔 Skills 总目录', repo: 'alchaincyf/huashu-skills',
    cat: 'pack', stars: 2102, img: '',
    desc: '花叔开源 skill 总目录：16 个旗舰 + 14 个人物视角 + 22 个内置，共 52 个，带分类和机器可读的 skills.json。',
    tags: ['中文', '52 skill', '总目录']
  },
  {
    id: 'yao-open-skills', name: 'OpenYao Skills', repo: 'yaojingang/yao-open-skills',
    cat: 'pack', stars: 1325, img: '',
    desc: 'OpenYao 的公共 skill 集：决策、商业分析、教程、研究，还有微信读书笔记这类场景。',
    tags: ['中文', '决策', '研究']
  },
  {
    id: 'huangshu', name: '黄叔 Skills', repo: 'Backtthefuture/huangshu',
    cat: 'pack', stars: 277, img: '',
    desc: '黄叔开源的 skill 集合。规模不大，可以当补充包翻一翻。',
    tags: ['中文', '合集']
  },
  {
    id: 'jamesrochabrun', name: 'James 的 Skills', repo: 'jamesrochabrun/skills',
    cat: 'pack', stars: 224, img: '',
    desc: '一个 Claude Code skills 合集仓库，结构清晰，适合当"s k i l l 目录该怎么组织"的参考。',
    tags: ['合集', '结构参考']
  },
  {
    id: 'daliu', name: '大刘 Skills', repo: 'idiotLeoLYJ/Daliu-Awesome-Skills',
    cat: 'pack', stars: 146, img: '',
    desc: '大刘（公众号「爱 AI 的大刘」）自建的高质量 skill 合集，含 skill-creator-cn（中文 skill 生成器）和十步学习法。',
    tags: ['中文', 'skill 生成', '学习法']
  },
  {
    id: 'kangarooking', name: '袋鼠帝 Skills', repo: 'kangarooking/kangarooking-skills',
    cat: 'pack', stars: 704, img: '',
    kind: 'collection',
    desc: '袋鼠帝把日常跑通的 16 个工作流全开源在这：封面签名、纸刊、品牌、3D、动效网站、选题、标题、视频下载、书稿配图、Agent 工程。按需挑着装，整包塞会给 agent 加冗余上下文。',
    tags: ['中文', '16 个 skill', '自媒体工作流'],
    /* subs：合集内每个子 skill 的目录名 / 归属分类 / 一句话。
       子 skill 单独建条目时用 skill 字段指向这里的 dir，保证两边不脱钩。 */
    subs: [
      { dir: 'cover-skill',                cat: 'image',    name: '封面签名',   one: '真人头像 + 袋鼠 IP，四套封面方案再套五种平台比例' },
      { dir: 'shijing-paper-zine',         cat: 'image',    name: '纸刊视觉',   one: '日常照片转克制、留白充足的纸刊编辑感' },
      { dir: 'apimart-image-gen',          cat: 'image',    name: 'APIMart 出图', one: '通过 APIMart 调 GPT-Image-2，生成、轮询、下载一条龙' },
      { dir: 'multi-agent-image',          cat: 'image',    name: '系列图生产', one: '设计编译 + 多 Agent 协作 + 案例库，批量做统一风格系列图' },
      { dir: 'hy-3d-gen',                  cat: 'image',    name: '混元 3D',    one: '腾讯混元文生 3D、图生 3D 与 PBR 模型' },
      { dir: 'storefront-to-brand-system', cat: 'design',   name: '店铺转品牌', one: '从真实店铺照片提炼品牌、空间、包装和社媒系统' },
      { dir: 'scroll-promo-site-builder',  cat: 'video',    name: '滚动动效站', one: '滚动驱动、电影感强的产品站，滚动条当进度条' },
      { dir: 'ai-article-daily',           cat: 'writing',  name: '公众号日更', one: 'AI 热点选题 → 成稿的完整 SOP' },
      { dir: 'viral-topic',                cat: 'writing',  name: '爆款选题',   one: '跨公众号、X、B 站、YouTube 找近期低粉爆款' },
      { dir: 'viral-title',                cat: 'writing',  name: '批量标题',   one: '四个平台各出一批高潜标题' },
      { dir: 'book-illustration-workflow', cat: 'writing',  name: '书稿配图',   one: '书稿截图、配图、回填与飞书同步' },
      { dir: 'twitter-monitor',            cat: 'intel',    name: 'X 动态监控', one: '抓 X 博主动态，按需同步到飞书多维表' },
      { dir: 'video-downloader',           cat: 'intel',    name: '视频转文案', one: '下载视频号 / B站 / YouTube / 抖音 / 小红书，配字幕和 ASR 出文案' },
      { dir: 'harness-engineering',        cat: 'meta',     name: 'Harness 框架', one: '给项目初始化 Plan-Build-Verify 工程框架' },
      { dir: 'task-harness',               cat: 'meta',     name: '长任务追踪', one: '把长任务拆成可追踪、可验证、可恢复的任务系统' },
      { dir: 'reshape-your-life',          cat: 'business', name: '人生重排',   one: '从使命、身份到行动，重新梳理方向' }
    ]
  },

  /* ---------- 商业与职场 ---------- */
  {
    id: 'career-ops', name: 'Career Ops 求职', repo: 'santifer/career-ops',
    cat: 'business', stars: 78482, img: 'santifer~career-ops.gif',
    desc: '求职 agent：扫招聘站、按你的 CV 给每个岗位打 1-5 分、筛掉不值得投的，再帮你改简历。海投效率翻倍。',
    tags: ['求职', '简历', '筛选']
  },
  {
    id: 'dbskill', name: '商业诊断', repo: 'dontbesilent2025/dbskill',
    cat: 'business', stars: 10937, img: '',
    desc: 'dontbesilent 的商业诊断 skill：从商业模式、定价到增长卡点，给结构化的诊断结论而不是空话。接咨询或做方案前先用一轮。',
    tags: ['商业分析', '诊断', '策略']
  },
  {
    id: 'pm-skills', name: 'PM Skills 产品经理', repo: 'zephyrwang6/pm-skills',
    cat: 'business', stars: 1148, img: '',
    desc: '产品经理的 skill 工厂：PRD、评审、需求排序、路线图、埋点、竞品，还配了一支方法论顾问团（Cagan、俞军等）。',
    tags: ['产品经理', 'PRD', '方法论']
  },
  {
    id: 'skill-productizer', name: 'Skill 产品化', repo: 'SpaceZephyr/skill-productizer',
    cat: 'business', stars: 6, img: '',
    desc: '把你的 skill 产品化、找变现路径：扫本地已装的 skill 和使用频率，结合 13 种产品化方法给方案。想把 skill 变成收入时用。',
    tags: ['变现', '产品化', '商业化']
  },

  /* ---------- 2026-10-31 增补：按发布人搜集的 14 条 ---------- */
  /* 花叔 */
  {
    id: 'huashu-report', name: '花叔研报 Report', repo: 'alchaincyf/huashu-report',
    cat: 'writing', stars: 478, img: '',
    desc: '把 41 份顶级机构报告拆成可执行规范：六种报告原型、8 种图表模式，从采集到排版一条流水线。要交正式研报时用它，别写口水稿。',
    tags: ['研究报告', '图表规范', '机构级']
  },
  {
    id: 'huashu-bird-sticker', name: '鸟类贴纸库', repo: 'alchaincyf/huashu-bird-sticker',
    cat: 'image', stars: 278, img: 'alchaincyf~huashu-bird-sticker.jpg', fit: 'contain',
    desc: '11064 种现存鸟类的贴纸素材，带 43 种语言名称和结构化数据。做科普、教材、图鉴类内容时直接取图，不用满网找图和查名字。',
    tags: ['贴纸素材', '鸟类', '结构化数据']
  },
  /* 科研 PPT 与公文 */
  {
    id: 'ppt-studio', name: 'PPT Studio 科研风', repo: 'bvb6417/ppt-studio',
    cat: 'slides', stars: 13, img: 'bvb6417~ppt-studio.jpg',
    desc: '照着公开的科研汇报版式固化审美：课题答辩、基金申请、组会汇报那种克制排版。做学术 PPT 时，比通用模板稳得多。',
    tags: ['科研风', '学术汇报', '可编辑']
  },
  {
    id: 'gongwen-gbt9704', name: '公文排版 GB/T 9704', repo: 'mizzlelover/gongwen-gbt9704-skill',
    cat: 'business', stars: 834, img: 'mizzlelover~gongwen-gbt9704-skill.jpg',
    desc: '按 GB/T 9704-2012 把内容排成合规公文，直接产出可编辑 DOCX。通知、请示、汇报材料不用再手动调字号、行距和版记。',
    tags: ['公文', '国标排版', 'DOCX']
  },
  /* 欧呦 oil-oil */
  {
    id: 'beautify-github-readme', name: 'README 美化', repo: 'oil-oil/beautify-github-readme',
    cat: 'design', stars: 1928, img: 'oil-oil~beautify-github-readme.jpg',
    desc: '给开源仓库做门面：SVG 标题区、顶部卡片、README 排版和文案一起改。功能一行没动，但看起来像个正经项目了。',
    tags: ['README', 'SVG', '仓库主页']
  },
  {
    id: 'oil-cover', name: 'Oil Cover 视频封面', repo: 'oil-oil/oil-cover',
    cat: 'image', stars: 284, img: 'oil-oil~oil-cover.jpg',
    desc: '从视频画面里挑帧做封面，同时出 3:4 竖版和 4:3 横版，小红书和 B 站各一份。省掉单独开设计软件那一步。',
    tags: ['视频封面', '多尺寸', '挑帧']
  },
  {
    id: 'video-publisher', name: 'Video Publisher 分发', repo: 'oil-oil/video-publisher-skill',
    cat: 'video', stars: 267, img: 'oil-oil~video-publisher-skill.jpg', fit: 'contain',
    desc: '一个视频准备成四个平台的草稿：标题、话题、封面、简介各按平台规则写好，卡在最终发布前等你确认。多平台分发不用重复填表。',
    tags: ['多平台', '草稿', '分发']
  },
  {
    id: 'oil-tone', name: 'Oil Tone 中文文风', repo: 'oil-oil/oil-tone',
    cat: 'writing', stars: 250, img: 'oil-oil~oil-tone.jpg', fit: 'contain',
    desc: '把「说人话」拆成可检查的规则：砍口号和套话、留具体概念、保留完整因果。成稿前跑一遍语法检查，不改到合规不放过。',
    tags: ['中文写作', '去 AI 味', '文风规范']
  },
  {
    id: 'codex-team-mode', name: 'Team Mode 子 Agent', repo: 'oil-oil/codex-team-mode',
    cat: 'meta', stars: 232, img: 'oil-oil~codex-team-mode.jpg', fit: 'contain',
    desc: '一次拉起四个分工明确的子 Agent：探索、执行、评审各管一段，便宜的模型干粗活，主 Agent 只做判断和验收。复杂任务既并行又省额度。',
    tags: ['子 Agent', '并行', '省额度']
  },
  {
    id: 'oil-visual', name: 'Oil Visual 概念插图', repo: 'oil-oil/oil-visual',
    cat: 'image', stars: 105, img: 'oil-oil~oil-visual.jpg',
    desc: '统一墨线漫画风的概念图：火柴人配小狗，能直接出透明底 PNG。插图抠好贴进 PPT，不会有一块矩形背景压住版面。',
    tags: ['概念插图', '透明底', '配图']
  },
  {
    id: 'oil-ppt', name: 'Oil PPT 网页演示', repo: 'oil-oil/oil-ppt',
    cat: 'slides', stars: 118, img: 'oil-oil~oil-ppt.jpg',
    desc: '做 16:9 的 HTML 演示文稿，能逐页改、能离线放，也能导出成可编辑 PPTX。想要网页的排版自由度，又不想断了 PPT 后路。',
    tags: ['HTML 幻灯片', '可编辑 PPTX', '离线']
  },
  {
    id: 'screen-studio-editor', name: 'Screen Studio 剪辑', repo: 'oil-oil/screen-studio-editor',
    cat: 'video', stars: 45, img: '',
    desc: '专治录屏里的停顿、口误、重讲和空片段，能合并补录、按讲述替换画面内容。剪口播视频最费时的那一段，交给它。',
    tags: ['录屏剪辑', '口误剔除', '补录']
  },
  {
    id: 'git-ship', name: 'Git Ship 提交流程', repo: 'oil-oil/git-ship',
    cat: 'meta', stars: 20, img: 'oil-oil~git-ship.jpg', fit: 'contain',
    desc: '一条命令跑完同步主干、开分支、提交、推送、建 PR、合并、切回主干拉最新。步骤多容易漏，干脆把整个流程固定下来。',
    tags: ['Git', '提交', 'PR']
  },
  {
    id: 'oil-html', name: 'Oil HTML 单页', repo: 'oil-oil/oil-html',
    cat: 'slides', stars: 20, img: 'oil-oil~oil-html.jpg', fit: 'contain',
    desc: '把要讲的东西做成一页可滚动的 HTML：文字、图解、界面示例、插图风格统一。只想讲清一个概念时，用不着做整套 PPT。',
    tags: ['单页 HTML', '讲解', '可分享']
  },

  /* ---------- 2026-10-31 第三批：顺着 5 位创作者的 GitHub 账号补的 16 条 ---------- */
  /* 花叔 */
  {
    id: 'zhangxuefeng-skill', name: '张雪峰思维 Skill', repo: 'alchaincyf/zhangxuefeng-skill',
    cat: 'knowledge', stars: 10661, img: 'alchaincyf~zhangxuefeng-skill.jpg',
    desc: '把张雪峰那套志愿、考研、职业规划的判断方式做成可对话的思维框架。填志愿、选专业、纠结要不要转行时，拿它当第二意见。',
    tags: ['志愿填报', '思维模型', '决策']
  },
  {
    id: 'huashu-art-motion', name: '艺术动画 Art Motion', repo: 'alchaincyf/huashu-art-motion',
    cat: 'video', stars: 5830, img: 'alchaincyf~huashu-art-motion.jpg',
    desc: '35 种艺术风格、9 种解说语法，用代码把静态内容做成会动的画。做科普片头、解说动画、风格化短片时用。',
    tags: ['艺术风格', '解说动画', '代码作画']
  },
  {
    id: 'huashu-md-html', name: 'MD 与 HTML 互转', repo: 'alchaincyf/huashu-md-html',
    cat: 'knowledge', stars: 933, img: 'alchaincyf~huashu-md-html.jpg',
    desc: '万物转 Markdown、Markdown 转精美 HTML、HTML 再转回来，三件事一套封装。把文档做成能直接发出去的网页时用它。',
    tags: ['格式转换', '网页排版', 'Pandoc']
  },
  {
    id: 'huashu-chrome', name: 'Chrome 操控', repo: 'alchaincyf/huashu-chrome',
    cat: 'meta', stars: 551, img: 'alchaincyf~huashu-chrome.jpg',
    desc: '让 agent 接管你自己的 Chrome，带着全部登录态，MCP 加扩展两端。要读后台数据、点内部系统时用，不用重新登录一遍。',
    tags: ['浏览器自动化', '登录态', 'MCP']
  },
  {
    id: 'huashu-excel', name: 'Excel 全流程', repo: 'alchaincyf/huashu-excel',
    cat: 'business', stars: 455, img: '',
    desc: '数据分析与 Excel 全流程：体检脏表、清洗、对齐需求、分析、对账、交付。要 AI 算出来的数字经得起追问时用它。',
    tags: ['Excel', '数据清洗', '对账']
  },
  /* 归藏 */
  {
    id: 'humanizer-zh', name: '中文去 AI 味', repo: 'op7418/Humanizer-zh',
    cat: 'writing', stars: 21570, img: '',
    desc: '消除中文文本里 AI 生成痕迹的汉化版。稿子读起来像人写的，去掉那种工整、对仗、爱总结、动不动就升华的腔调。',
    tags: ['去 AI 味', '中文写作', '改稿']
  },
  {
    id: 'nanobanana-ppt', name: 'NanoBanana PPT', repo: 'op7418/NanoBanana-PPT-Skills',
    cat: 'slides', stars: 3340, img: '',
    desc: '用 AI 生成整页 PPT 图片再串成演示，带智能转场和交互式播放。想要视觉冲击力强、一眼不像模板的演示时用它。',
    tags: ['整页出图', '转场', '交互播放']
  },
  {
    id: 'guizang-material-illustration', name: '材质插画', repo: 'op7418/guizang-material-illustration',
    cat: 'image', stars: 1234, img: '',
    desc: '归藏的材质插画 skill：生成带文字解释的示意图、美化图表、给文章配参考图。需要「一张图说清一件事」时用它。',
    tags: ['解释图', '图表美化', '配图']
  },
  {
    id: 'guizang-product-video', name: '产品宣传片', repo: 'op7418/guizang-product-video-skill',
    cat: 'video', stars: 888, img: 'op7418~guizang-product-video-skill.jpg',
    desc: '复用真实产品组件和设计语言，用代码做软件更新宣传片：分镜文案、原创配乐、动作音效、视频渲染一条龙。',
    tags: ['更新宣传片', '分镜', '配乐']
  },
  /* 宝玉 */
  {
    id: 'baoyu-design', name: 'Baoyu Design', repo: 'JimLiu/baoyu-design',
    cat: 'design', stars: 5523, img: 'JimLiu~baoyu-design.jpg',
    desc: '把 Claude Design 搬到本地跑的 agent skill：出精致 UI 稿、可交互原型、幻灯片。对界面完成度有要求时用它。',
    tags: ['UI 稿', '原型', '本地运行']
  },
  {
    id: 'baocut', name: 'BaoCut 剪辑', repo: 'JimLiu/baocut',
    cat: 'video', stars: 1633, img: '',
    desc: '带可编辑时间线的 AI 视频剪辑：转录、字幕、翻译、配音、剪切、动效。视频要改细节、又不想全交给黑箱时用它。',
    tags: ['时间线', '字幕翻译', '配音']
  },
  {
    id: 'smy-storyboard', name: '上美影短剧分镜', repo: 'liangdabiao/smy-seedance-storyboard',
    cat: 'video', stars: 234, img: 'liangdabiao~smy-seedance-storyboard.jpg', fit: 'contain',
    desc: '给一个故事（一句话、小说或神话典故），直接出整套上美影风格短剧制作文档：分镜剧本、专用色盘、角色场景出图提示词、Seedance 逐集提示词、尾帧衔接说明。想做复古手绘动画短片又不会拆分镜时用它。',
    tags: ['分镜脚本', '上美影风格', 'Seedance']
  },
  /* 卡兹克 */
  {
    id: 'aihot', name: 'AIHOT 热点站', repo: 'KKKKhazix/AIHOT',
    cat: 'intel', stars: 8956, img: 'KKKKhazix~AIHOT.jpg',
    desc: '自己找热点、自己写日报的网站框架。把信源和精选标准换成你的，就变成你所在行业的热点站。',
    tags: ['热点聚合', '日报', '自建站']
  },
  {
    id: 'human-writing', name: '活人感写作', repo: 'KKKKhazix/human-writing',
    cat: 'writing', stars: 4289, img: 'KKKKhazix~human-writing.jpg', fit: 'contain',
    desc: '让 AI 写的中文读起来像一个具体的人在说话，通用创作与改稿，开箱即用。比通用「去 AI 味」更直接。',
    tags: ['活人感', '改稿', '开箱即用']
  },
  /* 李继刚 */
  {
    id: 'ljg-xray-paper', name: '论文 X 光机', repo: 'lijigang/ljg-skill-xray-paper',
    cat: 'knowledge', stars: 607, img: '',
    desc: '解构学术论文，把方法和结论压缩成一个能写在餐巾纸上的公式。快速判断一篇论文值不值得细读。',
    tags: ['论文阅读', '拆解', '提炼']
  },
  {
    id: 'ljg-xray-book', name: '深度拆书机', repo: 'lijigang/ljg-skill-xray-book',
    cat: 'knowledge', stars: 473, img: '',
    desc: '三轮认知压缩，把一本书拆成可学习的结构，而不是摘抄金句。想把读书笔记沉淀成方法时用它。',
    tags: ['拆书', '结构化', '读书笔记']
  },
  {
    id: 'ljg-roundtable', name: '圆桌讨论', repo: 'lijigang/ljg-skill-roundtable',
    cat: 'knowledge', stars: 293, img: '',
    desc: '结构化圆桌：多个角色围绕同一个问题辩证对话，以求真而不是求赢为目标。决策前想听几种对立意见时用。',
    tags: ['多角色', '辩证', '决策辅助']
  },

  /* ---------- 合集里的精选子 skill（袋鼠帝 / kangarooking）
     这些条目 repo 指向合集仓库，skill 指向仓库内的子目录：
     - 前端装命令会自动变成 npx skills add <repo> --skill <skill>
     - from 指回合集条目 id，卡片和抽屉里会显示「合集内 / 出自合集」
     - stars 只能取仓库级（真实来源），所以同一合集的子条目星数相同 */
  {
    id: 'dai-cover', name: '袋鼠封面签名', repo: 'kangarooking/kangarooking-skills',
    path: 'tree/main/cover-skill', skill: 'cover-skill', from: 'kangarooking',
    cat: 'image', stars: 704, img: 'kangarooking~kangarooking-skills~cover-skill.png', fit: 'contain',
    desc: '给短视频、B站、公众号封面建一套个人视觉签名（真人头像 + 袋鼠 IP）：先出四套封面方案让你挑，再按五种平台比例重排。只服务自己的号，不接通用海报。',
    tags: ['封面', '个人 IP', '多平台比例']
  },
  {
    id: 'dai-scroll-site', name: '滚动动效站', repo: 'kangarooking/kangarooking-skills',
    path: 'tree/main/scroll-promo-site-builder', skill: 'scroll-promo-site-builder', from: 'kangarooking',
    cat: 'video', stars: 704, img: '',
    desc: '把产品做成往下滚就推进叙事的电影感网站：滚动位置直接驱动一条连续视频前进后退。发产品页、做发布会预告用它；普通企业站不合适。',
    tags: ['动效网站', '滚动叙事', 'image2.0']
  },
  {
    id: 'dai-viral-topic', name: '跨平台爆款选题', repo: 'kangarooking/kangarooking-skills',
    path: 'tree/main/viral-topic', skill: 'viral-topic', from: 'kangarooking',
    cat: 'writing', stars: 704, img: '',
    desc: '选题的路由层：你说「起号选题」或「最近有什么爆的」，它按平台分派到公众号 / X / B站 / YouTube 各自的采集逻辑，重点捞低粉爆款当参考。',
    tags: ['选题', '低粉爆款', '多平台']
  },
  {
    id: 'dai-article-daily', name: '公众号日更 SOP', repo: 'kangarooking/kangarooking-skills',
    path: 'tree/main/ai-article-daily', skill: 'ai-article-daily', from: 'kangarooking',
    cat: 'writing', stars: 704, img: '',
    desc: '从多平台抓当日 AI 热点 → 定选题 → 按固定声口成稿的完整流程，带用户画像和文风参考。日更压力大、又不想每篇从零想选题时用。',
    tags: ['公众号', '日更', 'AI 热点']
  },
  {
    id: 'dai-task-harness', name: '长任务 Harness', repo: 'kangarooking/kangarooking-skills',
    path: 'tree/main/task-harness', skill: 'task-harness', from: 'kangarooking',
    cat: 'meta', stars: 704, img: '',
    desc: '按 Anthropic「长时运行 agent 的 harness」方法论，把需求拆成结构化任务清单并持续跟踪完成度。跨多个会话推进的大改造，用它防止半路失忆。',
    tags: ['任务拆解', '长任务', '方法论']
  }
];

/* 站外延伸资源（非 GitHub 仓库，单独一块展示） */
window.RESOURCES = [
  { name: 'skills.sh', url: 'https://skills.sh', desc: 'Vercel 系的 skill 目录站，配合 npx skills 用' },
  { name: 'SkillsVote', url: 'https://skills.vote/', desc: 'skill 索引与投票排行，适合发现新东西' },
  { name: 'SkillHub 中文站', url: 'https://skillhub.cn/', desc: '中文 skill 聚合' },
  { name: 'Awesome DESIGN.md 索引', url: 'http://vibeui.top/?lang=zh', desc: 'DESIGN.md 设计规范的网页版索引' },
  { name: 'Karpathy 的 llm-wiki', url: 'https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f', desc: 'Karpathy 关于个人知识库的原始思路' },
  { name: '图表生成仓库对比讨论', url: 'https://web.tabbit.ai/share/chat/p2JuqAjz6U4f', desc: '几个图表 skill 的横向对比' }
];

/* ---------- 上游动态（抓取自 GitHub 的 commits.atom / releases.atom，不消耗 API 配额）
   格式：'owner/repo': [最近提交日期, 版本号(从 tag 里正则可抽则填,否则空), 发版日期]
   这条只是冷启动兜底：线上由 site/server.mjs 定时自动抓取，不需要手动跑脚本
   手动同步：node _tools/fetch-upstream.mjs --write ---------- */
window.UPS_FETCHED = '2026-11-05';
window.UPS = {
  'adrianpunk/punk-ip-illustrations': ['2026-11-04', '', ''],
  'Agents365-ai/drawio-skill': ['2026-11-01', 'v3.4.2', '2026-10-11'],
  'alchaincyf/darwin-skill': ['2026-09-18', '', ''],
  'alchaincyf/hermes-agent-orange-book': ['2026-10-20', '', ''],
  'alchaincyf/huashu-art-motion': ['2026-10-16', 'v1.2.0', '2026-10-16'],
  'alchaincyf/huashu-bird-sticker': ['2026-11-05', 'v2.2.0', '2026-11-05'],
  'alchaincyf/huashu-chrome': ['2026-10-13', '1.3.0', '2026-10-13'],
  'alchaincyf/huashu-design': ['2026-11-04', 'v3.2.0', '2026-11-04'],
  'alchaincyf/huashu-excel': ['2026-11-04', 'v1.1.0', '2026-11-04'],
  'alchaincyf/huashu-md-html': ['2026-10-13', 'v1.0.0', '2026-10-13'],
  'alchaincyf/huashu-motion': ['2026-10-22', 'v0.3.1', '2026-10-22'],
  'alchaincyf/huashu-report': ['2026-10-13', 'v1.0.0', '2026-10-13'],
  'alchaincyf/huashu-skills': ['2026-11-02', '', ''],
  'alchaincyf/nuwa-skill': ['2026-11-03', 'v1.1.0', '2026-11-03'],
  'alchaincyf/zhangxuefeng-skill': ['2026-10-13', 'v1.0.0', '2026-10-13'],
  'anthropics/skills': ['2026-10-28', '', ''],
  'Backtthefuture/huangshu': ['2026-08-03', 'v0.3.0', '2026-04-11'],
  'binggandata/bggg-skill-taotie': ['2026-05-03', '', ''],
  'bvb6417/ppt-studio': ['2026-10-16', '', ''],
  'cathrynlavery/diagram-design': ['2026-11-03', '', ''],
  'chuspeeism/dashi-ppt-skill': ['2026-09-12', '', ''],
  'Cocoon-AI/architecture-diagram-generator': ['2026-05-13', '', ''],
  'coleam00/excalidraw-diagram-skill': ['2026-03-01', '', ''],
  'dacnay816y62-hub/photo-revival': ['2026-09-05', '', ''],
  'dmoshehun-prog/learn-from-materials': ['2026-10-19', '1.1.0', '2026-10-19'],
  'dontbesilent2025/dbskill': ['2026-11-03', 'v3.2.3', '2026-11-03'],
  'forrestchang/andrej-karpathy-skills': ['2026-04-20', '', ''],
  'freestylefly/awesome-gpt-image-2': ['2026-11-05', 'v1.0.4', '2026-05-08'],
  'geekjourneyx/claude-design-card': ['2026-05-27', '', ''],
  'geeklee/srt-whiteboard-animation': ['2026-07-27', 'v1.0.0', '2026-07-27'],
  'gnipbao/story-to-handdrawn-video': ['2026-09-22', '', ''],
  'GordenSun/GordenPPTSkill': ['2026-06-22', '', ''],
  'hardikpandya/stop-slop': ['2026-03-17', '', ''],
  'Hchen1218/heytea-style': ['2026-09-04', 'v2.0.0', '2026-08-25'],
  'helloianneo/ian-xiaohei-illustrations': ['2026-10-27', 'v1.0.0', '2026-05-28'],
  'hugohe3/ppt-master': ['2026-11-05', 'v6.8.0', '2026-10-30'],
  'humanlayer/skills': ['2026-11-01', '', ''],
  'idiotLeoLYJ/Daliu-Awesome-Skills': ['2026-11-01', '', ''],
  'irenerachel/ebook-maker-skill': ['2026-04-19', '', ''],
  'isjiamu/gzh-design-skill': ['2026-10-21', 'v1.0.0', '2026-07-08'],
  'jakubkrehel/make-interfaces-feel-better': ['2026-08-29', '', ''],
  'jamesrochabrun/skills': ['2026-01-14', '2.1.1', '2026-01-14'],
  'JimLiu/baocut': ['2026-11-05', '3.16.0', '2026-11-04'],
  'JimLiu/baoyu-design': ['2026-11-05', 'v2.9.2', '2026-11-05'],
  'JimLiu/baoyu-skills': ['2026-11-02', 'v2.5.2', '2026-06-18'],
  'jitOffice/jit-motion': ['2026-09-20', '', ''],
  'joeseesun/qiaomu-markdown-proxy': ['2026-08-05', 'v2.1.0', '2026-08-05'],
  'JuliusBrussee/caveman': ['2026-11-02', 'v4.0.2', '2026-10-23'],
  'kangarooking/cangjie-skill': ['2026-10-02', 'v2.5.0', '2026-09-13'],
  'kangarooking/kangarooking-skills': ['2026-11-04', '', ''],
  'KKKKhazix/AIHOT': ['2026-11-05', '', ''],
  'KKKKhazix/human-writing': ['2026-08-05', '1.1.0', '2026-08-05'],
  'KKKKhazix/khazix-skills': ['2026-11-03', 'v1.1.0', '2026-11-03'],
  'larashero3-dotcom/writing-dna-skill': ['2026-11-05', '', ''],
  'larksuite/cli': ['2026-11-04', 'v1.0.99', '2026-11-04'],
  'LearnPrompt/luban-skill': ['2026-07-10', 'v2.1.0', '2026-07-10'],
  'Leonxlnx/taste-skill': ['2026-11-05', 'v2.5', '2026-11-04'],
  'lewislulu/html-ppt-skill': ['2026-09-14', '', ''],
  'liangdabiao/liurun-bookwriter-skills': ['2026-07-11', '', ''],
  'liangdabiao/smy-seedance-storyboard': ['2026-10-08', '', ''],
  'lijigang/ljg-skill-roundtable': ['2026-03-24', '', ''],
  'lijigang/ljg-skill-xray-book': ['2026-02-10', '', ''],
  'lijigang/ljg-skill-xray-paper': ['2026-02-26', '', ''],
  'lijigang/ljg-skills': ['2026-11-02', '', ''],
  'liyupi/ai-promo-video-maker': ['2026-10-09', '', ''],
  'mattpocock/skills': ['2026-10-31', 'v1.3.2', '2026-10-29'],
  'MemTensor/MemOS': ['2026-11-04', 'v2.0.21', '2026-11-04'],
  'microsoft/markitdown': ['2026-10-22', '0.1.9', '2026-10-21'],
  'MiniMax-AI/skills': ['2026-04-18', '', ''],
  'mizzlelover/gongwen-gbt9704-skill': ['2026-09-13', 'v2.0.0', '2026-09-11'],
  'mliu98/awesome-human-distillation': ['2026-11-05', '', ''],
  'MondayLabOS/larkwing-cli': ['2026-10-03', '', ''],
  'nesquena/hermes-webui': ['2026-11-05', 'v0.52.639', '2026-11-05'],
  'nextlevelbuilder/ui-ux-pro-max-skill': ['2026-11-05', 'v2.15.0', '2026-08-13'],
  'Nutlope/hallmark': ['2026-11-04', '', ''],
  'oaker-io/wewrite': ['2026-11-02', 'v4.2.1', '2026-07-16'],
  'oil-oil/beautify-github-readme': ['2026-10-04', '', ''],
  'oil-oil/codex-team-mode': ['2026-10-01', '', ''],
  'oil-oil/draw-ui': ['2026-10-04', '', ''],
  'oil-oil/git-ship': ['2026-09-10', '', ''],
  'oil-oil/oil-cover': ['2026-10-28', '', ''],
  'oil-oil/oil-html': ['2026-09-10', '', ''],
  'oil-oil/oil-ppt': ['2026-10-04', '', ''],
  'oil-oil/oil-tone': ['2026-09-23', '', ''],
  'oil-oil/oil-visual': ['2026-09-25', '', ''],
  'oil-oil/screen-studio-editor': ['2026-09-21', '', ''],
  'oil-oil/video-publisher-skill': ['2026-10-14', '', ''],
  'op7418/guizang-material-illustration': ['2026-07-07', '', ''],
  'op7418/guizang-ppt-skill': ['2026-10-30', 'v1.1.0', '2026-05-15'],
  'op7418/guizang-product-video-skill': ['2026-10-09', '', ''],
  'op7418/guizang-social-card-skill': ['2026-10-30', '', ''],
  'op7418/Humanizer-zh': ['2026-09-23', '', ''],
  'op7418/logo-generator-skill': ['2026-04-15', '', ''],
  'op7418/NanoBanana-PPT-Skills': ['2026-01-19', '', ''],
  'OpenSenseNova/SenseNova-Skills': ['2026-11-03', 'v2026.10', '2026-10-29'],
  'orange2ai/orange-line-illustration': ['2026-06-15', '', ''],
  'orz-ai/hot_news': ['2026-09-09', '', ''],
  'Panniantong/Agent-Reach': ['2026-11-05', 'v1.6.1', '2026-11-01'],
  'pbakaus/impeccable': ['2026-11-05', '4.8.0', '2026-10-26'],
  'peterskoett/self-improving-agent': ['2026-10-22', '', ''],
  'Russell-cell/PPT-as-code': ['2026-04-14', '', ''],
  's2dongman/knowledge-asset-health-check': ['2026-09-12', 'v1.0.5', '2026-09-07'],
  'santifer/career-ops': ['2026-11-05', 'v0.17.0', '2026-11-05'],
  'SaSaLiurong/edison': ['2026-06-14', 'v3.0', '2026-06-14'],
  'SpaceZephyr/skill-productizer': ['2026-07-22', '', ''],
  'SpaceZephyr/space-handdrawn-motion-video': ['2026-10-22', 'v0.2.0', '2026-10-21'],
  'tanweai/pua': ['2026-09-09', 'v3.5.1', '2026-09-09'],
  'thedotmack/claude-mem': ['2026-11-05', 'v15.9.0', '2026-11-02'],
  'titanwings/colleague-skill': ['2026-10-13', '', ''],
  'vercel-labs/agent-browser': ['2026-11-05', 'v0.41.2', '2026-11-03'],
  'vercel-labs/skills': ['2026-11-05', 'v1.7.6', '2026-11-03'],
  'VoltAgent/awesome-design-md': ['2026-10-28', '', ''],
  'wanikua/danghuangshang': ['2026-05-22', 'v3.6.1', '2026-03-30'],
  'Webioinfo01/aweskill': ['2026-09-13', 'v0.4.8', '2026-09-13'],
  'wheresryan22/anatomy': ['2026-10-18', '1.1', '2026-10-12'],
  'xiaohuailabs/tacit-mining': ['2026-04-08', '', ''],
  'yaojingang/yao-open-skills': ['2026-10-14', '', ''],
  'yizhiyanhua-ai/fireworks-tech-graph': ['2026-10-21', 'v1.2.0', '2026-07-17'],
  'YuppyChen/ai-wechat': ['2026-03-19', '', ''],
  'zarazhangrui/frontend-slides': ['2026-06-23', 'v2.1.0', '2026-05-26'],
  'zephyrwang6/info-skill': ['2026-07-06', '', ''],
  'zephyrwang6/pm-skills': ['2026-07-09', '', ''],
  'ZeroxZhang/huashu-bookwriter': ['2026-04-12', '', ''],
  'zhouwei713/luobo-ppt': ['2026-10-22', '', '']
};
