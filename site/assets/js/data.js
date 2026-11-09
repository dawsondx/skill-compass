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
    id: 'punk-ip', name: '朋克 IP 配图', repo: 'adrianpunk/Punk-IP',
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
    id: 'wewrite', name: 'WeWrite 公众号全流程', repo: 'imraywang/wewrite',
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
    id: 'colleague', name: '同事 Skill', repo: 'titanwings/distilly',
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
    id: 'info-skill', name: 'Read Buddy', repo: 'SpaceZephyr/read-buddy',
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
    id: 'karpathy-md', name: 'Karpathy 编程准则', repo: 'multica-ai/andrej-karpathy-skills',
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
    id: 'self-improving', name: '自我改进 Agent', repo: 'pskoett/self-improving-agent',
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
    id: 'aweskill', name: 'aweskill 包管理', repo: 'Wehuman01/aweskill',
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
    id: 'career-ops', name: 'Career Ops 求职', repo: 'career-ops-hq/career-ops',
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
    id: 'pm-skills', name: 'PM Skills 产品经理', repo: 'SpaceZephyr/pm-skills',
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
  },
  /* ---------- 2026-11-06 增补：IMA 开源 Skill 清单核对后新增的 165 条 ----------
     来源：资料库「开源Skill清单」（255 条）逐条核对 GitHub 是否可访问、是否与本站已有条目重复，
     剔除失效 / 非 skill 仓库后新增。这部分没有自托管演示图，img 留空。 */
  {
    id: 'nexu-io-open-design', name: 'Open Design 设计台', repo: 'nexu-io/open-design',
    cat: 'design', stars: 106199, img: '',
    desc: '本地优先的开源 AI 设计工作台，被当成 Claude Design 的平替：一句话出界面稿、改版迭代，还能把结果接进 Figma。想要「全流程留在自己机器上」时用它。',
    tags: ['设计工作台', '本地优先', 'Figma']
  },
  {
    id: 'emilkowalski-skills', name: 'Emil 动效与设计', repo: 'emilkowalski/skills',
    cat: 'design', stars: 53950, img: '',
    desc: '知名动效工程师 Emil Kowalski 的设计 skill 集：动画曲线、缓动、交互手感这些说不清的细节，被写成可执行的规则。做微交互容易「僵」时先过它。',
    tags: ['动效', '交互手感', '设计工程']
  },
  {
    id: 'jcodesmore-ai-website-cloner-template', name: '网站克隆模板', repo: 'jcodesmore/ai-website-cloner-template',
    cat: 'design', stars: 38714, img: '',
    desc: '一条命令克隆任意网站：把线上页面拆成可改的本地工程。要复刻一个竞品落地页的版式与动效、又不想从零写时用它。',
    tags: ['网站克隆', '复刻', '模板工程']
  },
  {
    id: 'elayadesign-ai-design-skills', name: 'AI 设计 skill 集', repo: 'elayadesign/ai-design-skills',
    cat: 'design', stars: 14455, img: '',
    desc: '落地页设计、Figma 内设计等一组自包含 skill，装单个就能用，不用整包塞。给 coding agent 补齐「设计这一步」时按需挑。',
    tags: ['落地页', 'Figma', '按需安装']
  },
  {
    id: 'ibelick-ui-skills', name: 'UI Skills 设计工程', repo: 'ibelick/ui-skills',
    cat: 'design', stars: 10699, img: '',
    desc: '设计工程师视角的界面 skill：组件结构、视觉层级、细节规范。写过很多页面但总被说「不像产品」时，补的是这一层。',
    tags: ['设计工程', '组件', '界面细节']
  },
  {
    id: 'spacezephyr-design-buddy', name: 'Design Buddy', repo: 'SpaceZephyr/design-buddy',
    cat: 'design', stars: 188, img: '',
    desc: '空格的键盘的视觉生产 skill 组合：品牌设计系统、图标、封面、产品图一站出。要成体系的视觉资产、不是单张配图时用它。',
    tags: ['品牌设计', '视觉资产', '成套产出']
  },
  {
    id: 'spacezephyr-personal-site-builder', name: '个人站生成器', repo: 'SpaceZephyr/personal-site-builder',
    cat: 'design', stars: 49, img: '',
    desc: '把简历、社交账号、作品集整理成能直接部署的静态个人站，中间会先逼你定信息层级和隐私清单。要一个「像样的个人主页」时用它。',
    tags: ['个人网站', '简历', '部署']
  },
  {
    id: 'tait-tt-tait-crt-interface-skill', name: 'CRT 复古界面', repo: 'tait-tt/tait-crt-interface-skill',
    cat: 'design', stars: 542, img: '',
    desc: '把界面做旧成 CRT 显像管风格：扫描线、荧光溢出、像素边缘。做复古游戏、蒸汽波视觉或怀旧专题页时一把到位。',
    tags: ['复古', 'CRT', '视觉风格']
  },
  {
    id: 'kunchenguid-no-mistakes', name: 'No Mistakes 提交闸门', repo: 'kunchenguid/no-mistakes',
    cat: 'meta', stars: 9146, img: '',
    desc: '在本机给 git 远端加一层代理：推上去之前自动开临时工作区跑一轮 AI 校验，过不了就别想合进主干。不想让 agent 把垃圾代码合进来时用它。',
    tags: ['Git', '提交校验', 'PR']
  },
  {
    id: 'anionex-banana-slides', name: 'Banana Slides', repo: 'anionex/banana-slides',
    cat: 'slides', stars: 15960, img: '',
    desc: '一站式的原生 PPT 生成应用：传模板图或素材，一句话或一份大纲直接出整套幻灯片。看「AI 做 PPT 产品」怎么落地时当参考实现，注意它本体是应用不是 skill。',
    tags: ['PPT 应用', '模板上传', '参考实现']
  },
  {
    id: 'nicobailon-visual-explainer', name: 'Visual Explainer', repo: 'nicobailon/visual-explainer',
    cat: 'slides', stars: 10817, img: '',
    desc: '把终端里那一坨输出变成能读的 HTML 页面或 deck：讲架构、审 diff、对比方案都行。agent 只会甩 ASCII 图时换成它。',
    tags: ['HTML 讲解页', '架构说明', '可读性']
  },
  {
    id: 'ningzimu-codex-ppt-skill', name: 'Codex PPT', repo: 'ningzimu/codex-ppt-skill',
    cat: 'slides', stars: 7676, img: '',
    desc: '先用 GPT-Image-2 生成整页图片再拼成演示文稿，视觉冲击力强。适合「一眼不像模板」的对外 deck；文字要逐字精确时反而不合适。',
    tags: ['整页出图', 'Codex', '视觉冲击']
  },
  {
    id: 'icip-cas-pptagent', name: 'PPTAgent', repo: 'icip-cas/pptagent',
    cat: 'slides', stars: 5205, img: '',
    desc: '中科院出的反思式 PPT 生成框架：先生成再自评重做。学术上要复现「agent 怎么做幻灯片」时读它，纯写作场景用它偏重。',
    tags: ['研究框架', '反思生成', '参考实现']
  },
  {
    id: 'zarazhangrui-beautiful-html-templates', name: 'HTML 模板库', repo: 'zarazhangrui/beautiful-html-templates',
    cat: 'slides', stars: 4938, img: '',
    desc: '一批挑好的 HTML 幻灯片模板，agent 按 AGENTS.md 的说明自己选。手上没有设计稿、又不想从白纸开始搭 deck 时用它打底。',
    tags: ['HTML 幻灯片', '模板', 'decks']
  },
  {
    id: 'sligter-landppt', name: 'LandPPT', repo: 'sligter/landppt',
    cat: 'slides', stars: 3642, img: '',
    desc: '基于大模型的演示文稿生成平台，文档进来、成套 PPT 出去，模板和样式可选。要自己搭一套内部 PPT 生成服务时看它的工程结构。',
    tags: ['文档转 PPT', '平台', '模板']
  },
  {
    id: 'allweonedev-presentation-ai', name: 'Presentation AI', repo: 'allweonedev/presentation-ai',
    cat: 'slides', stars: 3073, img: '',
    desc: '开源的 Gamma 平替：主题一句话出一套演示，能改能导。想自建「在线生成 PPT」产品时，拿它当起点比从零写省事。',
    tags: ['Gamma 平替', '在线生成', '产品参考']
  },
  {
    id: 'opendcai-paper2any', name: 'Paper2Any', repo: 'opendcai/paper2any',
    cat: 'slides', stars: 2824, img: '',
    desc: '论文、长文、一个选题进去，出来的是可编辑的科研插图、技术路线图和整套办公文档。做课题汇报、把论文变成图时用它。',
    tags: ['论文转图', '技术路线', '可编辑']
  },
  {
    id: 'gordensun-gordensuperpptskills', name: 'Gorden Super PPT', repo: 'gordensun/gordensuperpptskills',
    cat: 'slides', stars: 2228, img: '',
    desc: '先用 GPT 生成豪华图片版 PPT，再整份转成完全可编辑的 PPTX，拆成三个独立技能可分开用。既要好看又要能改字时走这条链。',
    tags: ['图片版 PPT', '转可编辑', '拆件']
  },
  {
    id: 'smartschoolai-ai-to-pptx', name: 'AI to PPTX', repo: 'smartschoolai/ai-to-pptx',
    cat: 'slides', stars: 1465, img: '',
    desc: '前后端全开源的 PPTX 生成助手，在线生成再导出。做办公类工具、想接一套「文档转演示」能力时的工程参考。',
    tags: ['PPTX 导出', '开源全栈', '办公']
  },
  {
    id: 'morgensonne-editdeck', name: 'EditDeck', repo: 'morgensonne/editdeck',
    cat: 'slides', stars: 1190, img: '',
    desc: '从需求文字一路到幻灯片图片、标准 PPTX 和可编辑 PPTX 的完整流水线。最烦的「图片版好看但改不了」这一环，它专门解决。',
    tags: ['流水线', '可编辑 PPTX', '成品交付']
  },
  {
    id: 'addsumtech-slides-maker', name: 'Slide Maker', repo: 'addsumtech/slides_maker',
    cat: 'slides', stars: 652, img: '',
    desc: '给论文、代码仓库、文档或一个主题，产出原生可编辑的演示稿，还自带独立评审环节挑毛病。交正式汇报前用它过一遍。',
    tags: ['可编辑', '自我评审', '论文转 deck']
  },
  {
    id: 'likaku-mck-ppt-design-skill', name: '麦肯锡风 PPT', repo: 'likaku/mck-ppt-design-skill',
    cat: 'slides', stars: 335, img: '',
    desc: '咨询公司那套版式被固化成了设计系统：70 种页面布局、图表规范和配色。要交「看起来很贵」的汇报材料时，比通用模板稳。',
    tags: ['咨询风', '版式系统', '汇报']
  },
  {
    id: 'op7418-guizang-sports-skill', name: '归藏运动数据', repo: 'op7418/guizang-sports-skill',
    cat: 'diagram', stars: 151, img: '',
    desc: '把 FIT、KML 这类运动轨迹数据做成可读的图表与地图：骑行、跑步、越野都行。要把一次训练讲成一张图时用它。',
    tags: ['运动数据', '轨迹图', '地图']
  },
  {
    id: 'spacezephyr-space-multi-design-ppt', name: '多风格品牌 PPT', repo: 'spacezephyr/space-multi-design-ppt',
    cat: 'slides', stars: 83, img: '',
    desc: '同一份内容能长成 62 种品牌气质：Apple、Notion、Stripe、Linear 这类风格可直接指定，也能让它按内容推荐。要「像某个品牌出的」deck 时用它。',
    tags: ['品牌风格', '62 种', '智能推荐']
  },
  {
    id: 'brycewang-stanford-many-ppt-skills', name: 'PPT skill 目录', repo: 'brycewang-stanford/many-ppt-skills',
    cat: 'pack', stars: 71, img: '',
    desc: '把值得知道的 AI 幻灯片 skill 收在一页里并排对比，标了 HTML 路线还是 PPTX 路线。要挑工具时先来这里扫，再决定装哪个。',
    tags: ['目录', '对比', '选型']
  },
  {
    id: 'alchaincyf-huashu-slide-doubao', name: '花叔豆包物料', repo: 'alchaincyf/huashu-slide-doubao',
    cat: 'slides', stars: 17, img: '',
    desc: '豆包专用（seedream 5.0 生图）的视觉物料 skill：一句话出 PPT、公众号头图、B 站封面、YouTube 缩略图。手上只有豆包额度时用它。',
    tags: ['豆包', '封面', '物料']
  },
  {
    id: 'debpalash-voicestudio', name: 'VoiceStudio 配音', repo: 'debpalash/voicestudio',
    cat: 'video', stars: 102253, img: '',
    desc: '全本地的开源配音棚：克隆音色、设计声音、配音、转写、旁白，覆盖 600 多种语言。视频要旁白又不想上传云端时用它。',
    tags: ['配音', '音色克隆', '本地跑']
  },
  {
    id: 'heygen-com-hyperframes', name: 'HyperFrames', repo: 'heygen-com/hyperframes',
    cat: 'video', stars: 79776, img: '',
    desc: '写 HTML 就能渲染成视频，专为 agent 设计。要程序化批量出片、又要精确控制每一帧排版时走这条路。',
    tags: ['HTML 转视频', '程序化', '批量']
  },
  {
    id: 'remotion-dev-skills', name: 'Remotion Skills', repo: 'remotion-dev/skills',
    cat: 'video', stars: 6443, img: '',
    desc: '用 React 写视频的官方 skill：组件、时间轴、渲染全按代码来。要做可复用模板、参数化出片时是底座级选择。',
    tags: ['React 视频', '官方', '代码出片']
  },
  {
    id: 'bradautomates-claude-video', name: 'Watch 看视频', repo: 'bradautomates/claude-video',
    cat: 'video', stars: 19972, img: '',
    desc: '给 agent 一副能看视频的眼睛：链接或本地文件变成带时间戳的关键帧加逐字稿，优先用原生字幕。要它评论一支片子、拆解口播结构时先装它。',
    tags: ['视频理解', '关键帧', '逐字稿']
  },
  {
    id: 'nexu-io-html-video', name: 'HTML Video', repo: 'nexu-io/html-video',
    cat: 'video', stars: 4812, img: '',
    desc: '在本机把 HTML 渲染成视频，粘贴一篇文章就能出片。想「先做网页再导出视频」、不依赖云服务时用它。',
    tags: ['HTML 转视频', '本地渲染', '文章成片']
  },
  {
    id: 'nexu-io-motion-anything', name: 'Motion Anything', repo: 'nexu-io/motion-anything',
    cat: 'video', stars: 1043, img: '',
    desc: '聊天式的动效引擎：描述一种「感觉」，它给你相应的动画，不用写关键帧。做界面动效预览、社媒小动画时比套模板自由。',
    tags: ['动效', '聊天式', '界面动画']
  },
  {
    id: 'nolangz-pixel2motion', name: 'Pixel2Motion', repo: 'nolangz/pixel2motion',
    cat: 'video', stars: 2597, img: '',
    desc: '把位图 Logo 变成平滑的 SVG 动画，带多尺寸规格和留白规则。品牌片头只有一张 logo 图、没有矢量源文件时的救急方案。',
    tags: ['Logo 动画', 'SVG', '品牌片头']
  },
  {
    id: 'vincentwei1021-video-shotcraft', name: 'ShotCraft 产品片', repo: 'vincentwei1021/video-shotcraft',
    cat: 'video', stars: 17356, img: '',
    desc: '电影感的产品宣传片 skill：镜头语言、分镜、可编辑的成片流程。要在没有实拍素材的情况下做出「像拍过」的产品片时用它。',
    tags: ['产品片', '分镜', '电影感']
  },
  {
    id: 'vincentwei1021-video-talkcraft', name: 'TalkCraft 口播', repo: 'vincentwei1021/video-talkcraft',
    cat: 'video', stars: 2132, img: '',
    desc: '口播视频专用：字级配音同步、108 张动效配方卡、反 PPT 的镜头系统，还带三重验收。单人做知识类口播、想剪出电影感时用。',
    tags: ['口播', '配音同步', '动效配方']
  },
  {
    id: 'spacezephyr-creator-buddy', name: 'Creator Buddy', repo: 'spacezephyr/creator-buddy',
    cat: 'intel', stars: 1836, img: '',
    desc: '创作者内容搜索的总控：给平台名加关键词，自动分派到小红书热门、公众号爆款、赛道分析等分支去捞素材。要选题和竞品拆解时先喊它。',
    tags: ['选题', '爆款检索', '多平台']
  },
  {
    id: 'zarazhangrui-beautiful-feishu-whiteboard', name: '飞书画板配色', repo: 'zarazhangrui/beautiful-feishu-whiteboard',
    cat: 'slides', stars: 786, img: '',
    desc: '35 套挑好的配色方案，专门用来把飞书 / Lark 白板做得好看且还能编辑。画布总是一片灰白、讲不清层次时用它。',
    tags: ['飞书', '白板', '配色']
  },
  {
    id: 'liyue-aigc-seedance-2-5-video-director', name: 'Seedance 视频导演', repo: 'liyue-aigc/seedance-2-5-video-director',
    cat: 'video', stars: 767, img: '',
    desc: '面向即梦 Seedance 2.5 的导演 skill：把创意、参考图、分镜整理成可执行脚本和复制即用的提示词，含人物锁定与续写。想稳定出片而不是靠手气时用。',
    tags: ['Seedance', '提示词', '分镜']
  },
  {
    id: 'gnipbao-minimax-h3-video-reverse-skill', name: 'MiniMax 视频反推', repo: 'gnipbao/minimax-h3-video-reverse-skill',
    cat: 'video', stars: 302, img: '',
    desc: '丢一段参考视频进去，它先说自己看懂了什么，再给出可复制的 MiniMax H3 提示词。你还能纠正它的理解、要求换主体或改成一镜到底。',
    tags: ['视频反推', '提示词', '可纠正']
  },
  {
    id: 'wyuzhi-qisi-video-remix', name: 'Qisi 视频二创', repo: 'wyuzhi/qisi-video-remix',
    cat: 'video', stars: 190, img: '',
    desc: '给一段参考视频，还你新故事、完整剧本、分镜表和分段提示词，默认走创意改编。想做「同款但不同故事」时省掉整段策划。',
    tags: ['二创', '剧本', '分镜']
  },
  {
    id: 'spacezephyr-map-motion', name: '地图动效', repo: 'spacezephyr/map-motion',
    cat: 'video', stars: 112, img: '',
    desc: '基于高德真实路线、行政边界和卫星高程做地图动画：vlog 片头「我在这里」、徒步海拔、骑行旅程都能出 MP4 和 GIF。要「路线动起来」时用它。',
    tags: ['地图动画', '高德', '路线']
  },
  {
    id: 'logamee-logamee-film-forge', name: '映画 Film Forge', repo: 'logamee/logamee-film-forge',
    cat: 'video', stars: 82, img: '',
    desc: '把文章变成有口播、有字幕、能直接录制的演示视频，生产和约束拆成两个 skill 分别安装。想把长文快速转成视频稿时用。',
    tags: ['文章成片', '口播', '录制']
  },
  {
    id: 'kangarooking-director-skills', name: '导演 Skills', repo: 'kangarooking/director-skills',
    cat: 'video', stars: 266, img: '',
    desc: '袋鼠帝的 AI 视频创作合集：从创意、剧本到分镜和提示词，把「导演」这个角色拆成可调用的步骤。要拍系列短片、需要统一叙事方法时用它。',
    tags: ['导演', '剧本', '系列短片']
  },
  {
    id: 'opensensenova-sensenova-6-8-code2video', name: 'Code2Video', repo: 'opensensenova/sensenova-6.8-code2video',
    cat: 'video', stars: 506, img: '',
    desc: '商汤开源的第一套代码驱动视频创作方案，附带 MG 动画 skill。想本地跑一套「写代码出 MG 动画」的能力时看它。',
    tags: ['代码出片', 'MG 动画', '开源模型']
  },
  {
    id: 'conardli-garden-skills', name: '花园 Skills', repo: 'conardli/garden-skills',
    cat: 'pack', stars: 14379, img: '',
    desc: 'ConardLi 开源的生产级 skill 集：网页设计、知识整理、短视频、网页演示都有，每个都是独立目录。按需挑着装，别整包塞。',
    tags: ['中文', '生产级', '按需安装']
  },
  {
    id: 'tjxj-z-skills', name: 'z-skills 中文工具箱', repo: 'tjxj/z-skills',
    cat: 'pack', stars: 638, img: '',
    desc: '20 个中文场景 skill：素材采集、视频下载、全景音频、文档解析、Markdown 转 Word/PDF、诗词成书、四格漫画配图。偏创作与知识管理，挑着装。',
    tags: ['中文', '20 个', '知识管理']
  },
  {
    id: 'binggandata-bggg-skills', name: '饼干 Skills', repo: 'binggandata/bggg-skills',
    cat: 'pack', stars: 617, img: '',
    desc: 'BGGG 的 Codex skill 合集，工作流和工具封装逐步往里放，软链到 skills 目录就能用。适合先逛一遍再挑几个。',
    tags: ['Codex', '合集', '工作流']
  },
  {
    id: 'youmind-openlab-skills', name: 'YouMind Skills', repo: 'youmind-openlab/skills',
    cat: 'pack', stars: 78, img: '',
    desc: 'YouMind 出的 agent skill：知识提取、内容创作、学习管理，还带发布链路。用它家产品时配套上最省心。',
    tags: ['知识提取', '内容创作', '发布']
  },
  {
    id: 'wuyoscar-jev-skill', name: 'Jev 判断技能', repo: 'wuyoscar/jev-skill',
    cat: 'pack', stars: 664, img: '',
    desc: '一套让 agent 自己选、自己评、自己路由的「判断」skill 集，附完整用例和工作流。想给 agent 加一层决策纪律时看它。',
    tags: ['路由', '自评', '工作流']
  },
  {
    id: 'liucongg-liucong-skills', name: '刘聪 Skills', repo: 'liucongg/liucong-skills',
    cat: 'pack', stars: 251, img: '',
    desc: 'NLP 工程师刘聪的 skill 仓：设计驱动建站、图文手册出可编辑 Word、多模型同题测评、三渲二短片提示词。偏工程与出稿质量，按需装。',
    tags: ['中文', '建站', '测评']
  },
  {
    id: 'zzzlc0405-photo-abstract-editorial', name: '照片抽象编辑', repo: 'zzzlc0405/photo-abstract-editorial',
    cat: 'image', stars: 6073, img: '',
    desc: '把一张照片拆成「原始摄影区 + 抽象记忆面板 + 诗意英文标题」的竖向编辑作品。做公众号头图、展览海报这类「有呼吸感」的版面时用它。',
    tags: ['照片编辑', '编辑设计', '竖向']
  },
  {
    id: 'zeejay0-gathered-scenes-zine-skill', name: '拾景纸刊', repo: 'zeejay0/gathered-scenes-zine-skill',
    cat: 'image', stars: 5625, img: '',
    desc: '先读照片里的主体、空间、色彩和没说出口的情绪，再决定是保留现场还是把它蒸馏成一页纸上作品。做纸刊、zine 风格图文时用。',
    tags: ['纸刊', 'zine', '阅读现场']
  },
  {
    id: 'liamgvchi-gc-minimal-zine-poster', name: '极简 zine 海报', repo: 'liamgvchi/gc-minimal-zine-poster',
    cat: 'image', stars: 7488, img: '',
    desc: '安静克制的杂志排版风格海报：留白、窄栏、克制字体。要「不吵」的视觉、又不想手工排时用它出稿。',
    tags: ['极简', '海报', '杂志排版']
  },
  {
    id: 'iotate-photo-story', name: '照片故事多', repo: 'iotate/photo-story',
    cat: 'image', stars: 49, img: '',
    desc: '保留原图的结构和布局，只换视觉材质：铅笔线、水彩、白描各讲一个故事。同一张照片要出几种艺术版本时用它。',
    tags: ['风格转换', '保留结构', '多版本']
  },
  {
    id: 'qqhkx2027-qiuqiu-travel-image', name: '球球旅行照', repo: 'qqhkx2027/qiuqiu-travel-image',
    cat: 'image', stars: 3, img: '',
    desc: '守人物、动作和空间关系，只换纸张、油墨、珐琅这些表达方式，把旅行照做成可收藏的视觉记忆。旅行博主整理旧图时好用。',
    tags: ['旅行照', '保真', '质感']
  },
  {
    id: 'vividvictor-transparent-image-generator', name: '透明底素材', repo: 'vividvictor/transparent-image-generator',
    cat: 'image', stars: 2, img: '',
    desc: '生成透明背景的 PNG/WebP：贴纸、边框、装饰、水印、产品图都能出，靠色键抠背。插图贴进 PPT 不再带一块白底。',
    tags: ['透明底', '抠图', '素材']
  },
  {
    id: 'spacezephyr-heart-sticker-imagegen-skill', name: '心念贴纸', repo: 'spacezephyr/heart-sticker-imagegen-skill',
    cat: 'image', stars: 14, img: '',
    desc: '传一张图或给一句要逐字呈现的文字，它先挑几种合适风格让你选，再出独一份贴纸。做表情包、社交配图时不用反复描述风格。',
    tags: ['贴纸', '选风格', '表情包']
  },
  {
    id: 's1dashu-ip-as-logo-skill', name: 'IP 变 Logo', repo: 's1dashu/ip-as-logo-skill',
    cat: 'image', stars: 6431, img: '',
    desc: '把形象做成极简、圆润、能直接用在公司物料上的 IP 吉祥物，复杂度有硬上限。想要「可爱但不幼稚」的品牌形象时用它。',
    tags: ['IP 吉祥物', '极简', '品牌']
  },
  {
    id: 'everettfish-ip-illustration-for-yourself', name: '萌粒风个人 IP', repo: 'everettfish/ip_illustration_for_yourself',
    cat: 'image', stars: 387, img: '',
    desc: '从一张确认过的形象锚点出发，生成整套风格统一的个人 IP 资产：插图、贴纸、头像、信纸、拍立得边框。做长期个人品牌视觉时用它。',
    tags: ['个人 IP', '统一风格', '成套']
  },
  {
    id: 'tanshilongmario-visual-memory-translator-skill', name: '影像转译', repo: 'tanshilongmario/visual-memory-translator-skill',
    cat: 'image', stars: 188, img: '',
    desc: '原图是现实记录，新图是记忆转译：把照片变成有出版气质的记忆页，也能把一句概念做成编辑隐喻卡。不是滤镜，也不是风格迁移。',
    tags: ['记忆页', '编辑感', '概念卡']
  },
  {
    id: 'mondaylabos-magazine-visuals', name: '杂志级视觉', repo: 'mondaylabos/magazine-visuals',
    cat: 'image', stars: 7, img: '',
    desc: '把栏目视觉拆成可复用、可编辑、可导出的设计系统：键帽海报、大标题加批注的栏目封面。做 newsletter 和知识栏目的固定视觉时用它。',
    tags: ['栏目视觉', '可复用', '导出']
  },
  {
    id: 'kaankiziltug-logo-design-skill', name: 'Logo 设计', repo: 'kaankiziltug/logo-design-skill',
    cat: 'image', stars: 6090, img: '',
    desc: '完整的 logo 设计流程：先问清品牌定位，再出概念、做字形与图形、给多场景应用。需要一整套 logo 方案而不是一张图时用。',
    tags: ['Logo', '品牌定位', '多场景']
  },
  {
    id: 'adrianpunk-punk-posters', name: 'Punk 封面', repo: 'adrianpunk/punk-posters',
    cat: 'image', stars: 1438, img: '',
    desc: '把文章生成封面图，或把人物、宠物、物品照片做成头像，风格统一。注意个人非商用免费，商业用途要单独授权。',
    tags: ['封面', '头像', '授权注意']
  },
  {
    id: 'alchaincyf-huashu-icon-set', name: '花叔图标集', repo: 'alchaincyf/huashu-icon-set',
    cat: 'image', stars: 14, img: '',
    desc: '端到端为一整个项目生成风格统一的图标：读代码定清单、定风格锚点、批量生图、智能抠图、落位到项目。图标风格乱的项目收尾时用它。',
    tags: ['图标', '成套', '抠图']
  },
  {
    id: 'ziguishian-xhs-visual-director-skill', name: '小红书视觉导演', repo: 'ziguishian/xhs-visual-director-skill',
    cat: 'image', stars: 1505, img: '',
    desc: '不是文案助手，是视觉导演：先判断这条内容要干什么，再选视觉风格，最后给出整套图文方案。小红书图文总做不出统一调性时用它。',
    tags: ['小红书', '视觉导演', '图文']
  },
  {
    id: 'nuyoah-ai-works-nuyoah-xiezhen-prompt', name: '南鸢写真提示词', repo: 'nuyoah-ai-works/nuyoah-xiezhen-prompt',
    cat: 'image', stars: 782, img: '',
    desc: '一套写真风格的提示词 skill：给出人物、场景、光线和材质的组合写法。想稳定复现某种人像质感时拿它当模板。',
    tags: ['写真', '提示词', '人像']
  },
  {
    id: 'regan-sun-toastmasters-vertical-infographic', name: '头马长图', repo: 'regan-sun/toastmasters-vertical-infographic',
    cat: 'image', stars: 2, img: '',
    desc: '做竖版信息长图，含内容结构、品牌规范和发布前校验脚本，适配国内 WorkBuddy。要做活动海报、知识长图时用。',
    tags: ['长图', '信息图', '校验']
  },
  {
    id: 'tw93-kami', name: 'Kami 排版', repo: 'tw93/kami',
    cat: 'writing', stars: 12290, img: '',
    desc: '一套把文档排得像印出来的规则与模板：字号、行距、留白、图表位置都有定式。Markdown 写完总觉得「差点意思」时用它收版面。',
    tags: ['文档排版', '模板', '印刷感']
  },
  {
    id: 'conorbronsdon-avoid-ai-writing', name: '审计 AI 文风', repo: 'conorbronsdon/avoid-ai-writing',
    cat: 'writing', stars: 5452, img: '',
    desc: '审一遍稿子，指出「值得注意的是」「与此同时」这类 AI 腔并重写。成稿前跑一遍，比人眼找痕迹快。',
    tags: ['去 AI 味', '审计', '改稿']
  },
  {
    id: 'norman-bury-research-writing-skill', name: '科研写作', repo: 'norman-bury/research-writing-skill',
    cat: 'writing', stars: 3596, img: '',
    desc: '论文与研究报告的写作助手：结构、论证、引用与表述规范一起管。写期刊稿、基金本子时用它避免低级失误。',
    tags: ['论文', '科研', '规范']
  },
  {
    id: 'larashero3-dotcom-lieflat-gongwen', name: '公文写作', repo: 'larashero3-dotcom/lieflat-gongwen',
    cat: 'writing', stars: 2393, img: '',
    desc: '用 102 万字真公文语料提炼出的写作 skill，把文体特征变成可测量的指标，写完自己判分。要交正式公文、又怕写成文章腔时用。',
    tags: ['公文', '语料', '自评分']
  },
  {
    id: 'comeonzhj-auto-redbook-skills', name: '小红书卡片', repo: 'comeonzhj/auto-redbook-skills',
    cat: 'writing', stars: 2450, img: '',
    desc: '自动写笔记、自动出图、自动发布的完整链路。注意官方对 AI 托管运营有治理公告，账号风险自己把握。',
    tags: ['小红书', '自动发布', '风险提示']
  },
  {
    id: 'mengke-wang-xiaohongshu-ai-workbench', name: '小红书 AI 工作台', repo: 'mengke-wang/xiaohongshu-ai-workbench',
    cat: 'writing', stars: 620, img: '',
    desc: '配《小红书运营手册》用的一组 Codex skill：手册讲判断，工作台帮你执行。有产品、有经验但讲不清楚时用它把内容说透。',
    tags: ['小红书', '运营', '执行']
  },
  {
    id: 'irenerachel-xiaohongshu-layout-factory-skill', name: '小红书排版工厂', repo: 'irenerachel/xiaohongshu-layout-factory-skill',
    cat: 'writing', stars: 26, img: '',
    desc: '先把你的一次性素材做成专属排版 skill，之后每篇新文章都沿用同一套角色、配色和版式，直接出 3:4 图集与 PNG。要稳定更新封面时用它。',
    tags: ['小红书', '版式复用', '图集']
  },
  {
    id: 'wshuyi-x-article-publisher-skill', name: 'X 文章发布', repo: 'wshuyi/x-article-publisher-skill',
    cat: 'writing', stars: 872, img: '',
    desc: '一条命令把 Markdown 文章发到 X 长文，支持分隔线、表格转图、Mermaid。省掉在富文本编辑器里反复粘贴调格式。',
    tags: ['X', '发布', 'Markdown']
  },
  {
    id: 'jzocb-writing-style-skill', name: '写作风格自学', repo: 'jzocb/writing-style-skill',
    cat: 'writing', stars: 275, img: '',
    desc: '写作风格 skill 模板，内置自动学习：从你每次改稿里提取规则，越用越像你。想让 AI 长期模仿你的笔调时从它起步。',
    tags: ['文风', '自动学习', '改稿']
  },
  {
    id: 'zhouwei713-title-matrix', name: '标题矩阵', repo: 'zhouwei713/title-matrix',
    cat: 'writing', stars: 34, img: '',
    desc: '把同一篇内容改写成适合不同平台的标题，还负责诊断旧标题、评审候选、复盘数据。标题可以有力，但不能夸大事实范围——它有硬约束。',
    tags: ['标题', '多平台', '诊断']
  },
  {
    id: 'aiolosking-podcast-reflection-publisher', name: '播客听后感', repo: 'aiolosking/podcast-reflection-publisher',
    cat: 'writing', stars: 11, img: '',
    desc: '听完一整期播客，核对事实，按你的风格写成有独立立意的图文，出可断网打开的 HTML 并发布成免登录链接。不是「帮我总结这期」。',
    tags: ['播客', '长文', '发布']
  },
  {
    id: 'waterbrojx-water-koubo', name: '口播二创', repo: 'waterbrojx/water-koubo',
    cat: 'writing', stars: 40, img: '',
    desc: '给一篇参考稿，直接还你标题、封面文字和一篇能拍的口播稿。短视频口播从模仿到落地的中间步骤，它一并做掉。',
    tags: ['口播', '二创', '短视频']
  },
  {
    id: 'blader-humanizer', name: 'Humanizer', repo: 'blader/humanizer',
    cat: 'writing', stars: 65393, img: '',
    desc: '英文写作去 AI 痕迹的经典 skill：删掉那些「correct but useless」的表述。写英文稿、发英文帖前先过它。',
    tags: ['去 AI 味', '英文', '改稿']
  },
  {
    id: 'regan-sun-refining-transcripts-skill', name: '转写精修', repo: 'regan-sun/refining-transcripts-skill',
    cat: 'writing', stars: 3, img: '',
    desc: '把语音转写稿精修成能交付的 Word：只留逐字稿正文、说话人、时间戳和原位待核标记，默认排好版。整理访谈录音时用。',
    tags: ['转写', '精修', 'Word']
  },
  {
    id: 'kangarooking-x-growth-skills', name: 'X 增长', repo: 'kangarooking/x-growth-skills',
    cat: 'writing', stars: 73, img: '',
    desc: '面向 X 创作者的 15 个实战 skill：账号定位、主页装修、冷启动、内容生产、算法、互动增长、复盘与变现。不承诺爆款，只给可执行动作。',
    tags: ['X 运营', '增长', '15 个']
  },
  {
    id: 'virgiliojr94-book-to-skill', name: '书变 Skill', repo: 'virgiliojr94/book-to-skill',
    cat: 'knowledge', stars: 37104, img: '',
    desc: '把一本技术书 PDF 变成一个能随时查、随时用的 skill，而不是一份摘要。啃厚书想留下可复用知识时，这条路比自己记笔记彻底。',
    tags: ['书', 'PDF', '知识沉淀']
  },
  {
    id: 'kepano-obsidian-skills', name: 'Obsidian Skills', repo: 'kepano/obsidian-skills',
    cat: 'knowledge', stars: 50863, img: '',
    desc: 'Obsidian 官方出的 agent skill：让 agent 会用 Obsidian CLI、按规范读写你的库。笔记库交给 agent 打理时的正门。',
    tags: ['Obsidian', '笔记', 'CLI']
  },
  {
    id: 'anthropics-k12-teacher-skills', name: 'K12 教师 Skills', repo: 'anthropics/k12-teacher-skills',
    cat: 'knowledge', stars: 613, img: '',
    desc: 'Anthropic 与 Learning Commons 合作的教师 skill：备课、分层教学、评分量规。做教育产品、或自己带课时可直接套。',
    tags: ['教育', '备课', '量规']
  },
  {
    id: 'einsia-browser-bc', name: '录屏蒸馏 Skill', repo: 'einsia/browser-bc',
    cat: 'knowledge', stars: 559, img: '',
    desc: '把你操作一遍浏览器的录屏，蒸馏成可复用的行为克隆 skill，背后是行为克隆的论文实现。教 agent 用内部系统时，示范一遍比写文档快。',
    tags: ['行为克隆', '录屏', '内部系统']
  },
  {
    id: 'liyupi-yupi-skill', name: '鱼皮 Skill', repo: 'liyupi/yupi-skill',
    cat: 'knowledge', stars: 456, img: '',
    desc: '把程序员鱼皮的思维方式与表达风格蒸馏成 skill：编程学习、求职面试、AI 编程、简历优化都按他那套判断来答。想听「一个人」的意见时用。',
    tags: ['人物蒸馏', '编程', '求职']
  },
  {
    id: 'liyupi-codefather', name: '鱼皮编程宝典', repo: 'liyupi/codefather',
    cat: 'knowledge', stars: 9003, img: '',
    desc: '一份成体系的编程学习路线与知识百科，覆盖 Java、前端、Python、C++、算法。要规划学习路径时当参考书，不是 skill 包。',
    tags: ['学习路线', '知识库', '编程']
  },
  {
    id: 'wzdavid-thinkwiki', name: 'ThinkWiki', repo: 'wzdavid/thinkwiki',
    cat: 'knowledge', stars: 38, img: '',
    desc: '装一次，之后直接跟 agent 聊：把文档和笔记变成本地知识库问答。要「自己的资料能被问」而不是丢进云端黑箱时用它。',
    tags: ['本地知识库', '问答', '文档']
  },
  {
    id: 'hexiaofeier-baojie', name: '保洁 研究核验', repo: 'hexiaofeier/baojie',
    cat: 'knowledge', stars: 15, img: '',
    desc: '给研究工作做两类检查：过程里把公开资料整理成可复核的证据，交付前核对报告、图表、附件并复查修改结果。写研报前的最后一道工序。',
    tags: ['研究', '核验', '证据']
  },
  {
    id: 'kingkk469-creator-distiller', name: '博主蒸馏', repo: 'kingkk469/creator-distiller',
    cat: 'knowledge', stars: 13, img: '',
    desc: '把一个博主当前可见的视频整理成可答疑、可诊断的专家 skill，核心观点都能回到原视频。想借用某个人的判断框架时用它，而不是只看合集。',
    tags: ['博主', '蒸馏', '可回源']
  },
  {
    id: 'hjxccc-nowledge', name: 'Nowledge 现查式学习', repo: 'hjxccc/nowledge',
    cat: 'knowledge', stars: 6, img: '',
    desc: '不信训练记忆：先联网抓一手资料，再判断选材，逼你动手、复述、复训。学一个新领域、怕被旧知识误导时用。',
    tags: ['学习闭环', '联网', '复述']
  },
  {
    id: 'egonex-ai-understand-anything', name: '代码变知识图谱', repo: 'egonex-ai/understand-anything',
    cat: 'knowledge', stars: 91022, img: '',
    desc: '把一个代码库整理成可点击、可搜索、可提问的交互式知识图谱。新进一个项目、想先搞清楚系统怎么分层时，比通读代码快。',
    tags: ['代码库', '知识图谱', '上手']
  },
  {
    id: 'graphify-labs-graphify', name: 'Graphify', repo: 'Graphify-Labs/graphify',
    cat: 'knowledge', stars: 143170, img: '',
    desc: '把代码、文档、SQL 结构、配置和 PDF 一起抽成一张可查询的关系图。系统大到一个脑子装不下时，用它先画出结构。',
    tags: ['知识图谱', '代码理解', '关系图']
  },
  {
    id: 'thu-maic-openmaic', name: 'OpenMAIC 多智能体课堂', repo: 'thu-maic/openmaic',
    cat: 'knowledge', stars: 42776, img: '',
    desc: '清华开源的多智能体互动课堂：多个角色分工讲课、答疑、演练。要做沉浸式教学场景或研究教育 agent 时看它。',
    tags: ['教育', '多智能体', '课堂']
  },
  {
    id: 'jackwener-wechat-article-to-markdown', name: '公众号转 MD', repo: 'jackwener/wechat-article-to-markdown',
    cat: 'knowledge', stars: 1082, img: '',
    desc: '抓取公众号文章并转成干净 Markdown，带反检测抓取。整理素材、存档竞品文章时省掉手工清洗。',
    tags: ['公众号', 'Markdown', '抓取']
  },
  {
    id: 'lovstudio-any2pdf', name: 'any2pdf', repo: 'lovstudio/any2pdf',
    cat: 'knowledge', stars: 213, img: '',
    desc: '一句「转 PDF」就出排版精致的文档，不用配模板、不碰 LaTeX。要交一份能直接发出去的 PDF 时用它。',
    tags: ['PDF', '排版', '免配置']
  },
  {
    id: 'zeroxzhang-md2book', name: 'md2book', repo: 'zeroxzhang/md2book',
    cat: 'knowledge', stars: 61, img: '',
    desc: '把 Markdown 变成排版讲究的 PDF 电子书：智能分页、自动目录、封面设计、中文字体处理，还带三套主题。要出书稿成品时用它。',
    tags: ['电子书', 'PDF', '中文排版']
  },
  {
    id: 'aiolosking-english-textbook-reader', name: '英语教材点读', repo: 'aiolosking/english-textbook-reader',
    cat: 'knowledge', stars: 1, img: '',
    desc: '教材页面图片加配套录音，做成可点读的课本网页：逐句切原声、图中热区点读、跟读与单句重复，还能发布成免登录链接。给孩子做点读材料时用。',
    tags: ['点读', '教材', '原声切分']
  },
  {
    id: 'nicotine00-blinkoo-vibe-daily', name: 'Blinkoo 工具箱', repo: 'nicotine00/blinkoo-vibe-daily',
    cat: 'meta', stars: 5, img: '',
    desc: '日常开发沉淀下来的规则文件与 skill：新项目开工规则 AGENTS.md、老项目体检清单。开新项目前先把规则放进去，比事后补规范省事。',
    tags: ['AGENTS.md', '项目体检', '规则']
  },
  {
    id: 'hexiaofeier-tanzi', name: '探子 信息采集', repo: 'hexiaofeier/tanzi',
    cat: 'intel', stars: 39, img: '',
    desc: '不坐在搜索框前等答案，而是带着明确问题去各平台探路：先找线索，再读正文，记下来源。做调研前的原料收集时用它。',
    tags: ['信息采集', '多平台', '溯源']
  },
  {
    id: 'mvanhorn-last30days-skill', name: '最近 30 天', repo: 'mvanhorn/last30days-skill',
    cat: 'intel', stars: 66779, img: '',
    desc: '以点赞、投票为权重的 agent 搜索引擎，专扫 Reddit、X、YouTube、HN 最近 30 天的讨论，输出带原始来源的报告。判断一个话题「现在到底什么情况」时用它。',
    tags: ['近 30 天', '跨平台', '带出处']
  },
  {
    id: 'jesseovo-last30days-skill-cn', name: '最近 30 天 · 中文版', repo: 'jesseovo/last30days-skill-cn',
    cat: 'intel', stars: 2059, img: '',
    desc: '同一思路的中文互联网版本：检索 8 大平台最近 30 天的讨论，追踪跨平台热点，每天还能出一份热榜。做中文选题时比英文版对味。',
    tags: ['中文互联网', '热点', '日报']
  },
  {
    id: 'eze-is-web-access', name: 'Web Access 联网', repo: 'eze-is/web-access',
    cat: 'intel', stars: 9349, img: '',
    desc: '给本机 agent 装完整联网能力：三层通道调度加浏览器 CDP 直连，该用哪个通道它自己判断。内置搜索满足不了时补这一层。',
    tags: ['联网', 'CDP', '三层通道']
  },
  {
    id: 'browser-act-skills', name: 'Browser Act', repo: 'browser-act/skills',
    cat: 'intel', stars: 6325, img: '',
    desc: '面向 agent 的浏览器自动化 CLI，能过反爬、支持代理与多 session。Playwright 被站点识别拦下来时换它试。',
    tags: ['浏览器自动化', '反爬', '代理']
  },
  {
    id: 'redfox-data-redfox-community', name: '红狐数据', repo: 'redfox-data/redfox-community',
    cat: 'intel', stars: 455, img: '',
    desc: '面向 agent 的可复用 skill 集合，覆盖灵感、选题、文案创作和数据复盘。做内容账号的日常运营时当工具箱。',
    tags: ['选题', '文案', '复盘']
  },
  {
    id: 'unnoo-zsxq-skill', name: '知识星球官方', repo: 'unnoo/zsxq-skill',
    cat: 'intel', stars: 323, img: '',
    desc: '知识星球官方维护的 skill：巡场、回评论、整理精华、出日报海报，也能搜内容、发帖、定时发布。星主日常维护用一句话顶几步手工活。',
    tags: ['知识星球', '官方', '运营']
  },
  {
    id: 'netease-skills', name: '网易云音乐 Skills', repo: 'netease/skills',
    cat: 'intel', stars: 263, img: '',
    desc: '基于 ncm-cli 的网易云音乐 agent 技能包：搜歌、播放、歌单管理、红心偏好画像。想让 agent 按你的口味选歌时用它。',
    tags: ['网易云', '歌单', '偏好画像']
  },
  {
    id: 'jackwener-opencli', name: 'OpenCLI', repo: 'jackwener/opencli',
    cat: 'intel', stars: 30927, img: '',
    desc: '把任意网站变成 CLI，还能复用你已登录的浏览器会话。内部系统没有 API、只能点页面时，用它给 agent 开一条路。',
    tags: ['网站转 CLI', '登录态', '内部系统']
  },
  {
    id: 'joeseesun-qiaomu-opencli-skills', name: '乔木 OpenCLI Skills', repo: 'joeseesun/qiaomu-opencli-skills',
    cat: 'intel', stars: 998, img: '',
    desc: '把 opencli 的用法封装成现成 skill：B 站、知乎等站点直接调，不用自己拼命令。已经装了 opencli 的话装上它立刻能用。',
    tags: ['opencli', '封装', '现成']
  },
  {
    id: 'zarazhangrui-follow-builders', name: 'Follow Builders', repo: 'zarazhangrui/follow-builders',
    cat: 'intel', stars: 7079, img: '',
    desc: '只盯真正在做东西的人：AI 研究员、创始人、PM、工程师在 X 和播客上说了什么，定期给你摘要。不想被二手解读带节奏时用它。',
    tags: ['信息源', 'AI  builders', '摘要']
  },
  {
    id: 'alibaba-flyai-flyai-skill', name: '飞猪 Agent Skill', repo: 'alibaba-flyai/flyai-skill',
    cat: 'intel', stars: 1288, img: '',
    desc: '飞猪出的旅行 agent skill：查行程、比价、做旅行方案。要在大模型里接一套真实的机酒能力时看它的接口设计。',
    tags: ['旅行', '机酒', '接口']
  },
  {
    id: 'obra-superpowers', name: 'Superpowers', repo: 'obra/superpowers',
    cat: 'meta', stars: 313225, img: '',
    desc: '一套跨工具的 agent skill 框架，还带完整软件开发方法论：从需求到验证的每个环节都有对应 skill。想给整个团队定「agent 怎么干活」时用它。',
    tags: ['框架', '方法论', '跨工具']
  },
  {
    id: 'affaan-m-ecc', name: 'Everything Claude Code', repo: 'affaan-m/ecc',
    cat: 'meta', stars: 298079, img: '',
    desc: '把 Claude Code 的性能榨干：skill、直觉、hooks、子 agent 一整套配置。感觉自家 agent「明明能更强但不知道缺什么」时对着它抄。',
    tags: ['Claude Code', '配置', '性能']
  },
  {
    id: 'addyosmani-agent-skills', name: 'Addy Osmani Skills', repo: 'addyosmani/agent-skills',
    cat: 'meta', stars: 113595, img: '',
    desc: 'Google 工程师 Addy Osmani 的生产级编码 skill：代码审查、性能、架构决策都写成可执行清单。给 agent 立工程标准时直接引用。',
    tags: ['工程实践', '代码审查', '性能']
  },
  {
    id: 'morluto-rea', name: 'REA 逆向', repo: 'morluto/rea',
    cat: 'meta', stars: 435755, img: '',
    desc: '用 agent 逆向任何东西：从 App 行为一路挖到原生实现，附带方法论与工具链。分析你有权分析的目标时，它给的是流程而不是零散命令。',
    tags: ['逆向', 'Agent', '方法论']
  },
  {
    id: 'garrytan-gstack', name: 'gstack', repo: 'garrytan/gstack',
    cat: 'meta', stars: 140220, img: '',
    desc: 'Garry Tan 自己的 Claude Code 配置：23 个有主见的工具，专门挑 bug、边界情况、安全风险和 UX 问题。想过一遍「高级工程师会怎么审」时用它。',
    tags: ['代码审查', '配置', '风险']
  },
  {
    id: 'zhaoxuya520-reverse-skill', name: 'Reverse Skill', repo: 'zhaoxuya520/reverse-skill',
    cat: 'meta', stars: 44199, img: '',
    desc: '逆向工程、授权渗透测试与安全研究的 skill 集，把常见分析路径固化成流程。做安全评估时少走弯路。',
    tags: ['逆向', '渗透', '安全']
  },
  {
    id: 'microsoft-skillopt', name: 'SkillOpt', repo: 'microsoft/skillopt',
    cat: 'meta', stars: 18917, img: '',
    desc: '微软研究的文本空间优化器：像训练模型一样自动训练和优化 skill。手上 skill 效果不稳、想系统性调优时看它。',
    tags: ['skill 优化', '自动训练', '研究']
  },
  {
    id: 'microsoft-skill-recorder', name: 'Skill Recorder', repo: 'microsoft/skill-recorder',
    cat: 'meta', stars: 5698, img: '',
    desc: '录下你在屏幕上的一次完整操作，再让 GitHub Copilot 把它转成 skill。有那种「只能手把手教」的流程时，示范一遍就够。',
    tags: ['录屏', '转 skill', 'Copilot']
  },
  {
    id: 'steipete-agent-scripts', name: 'Agent Scripts', repo: 'steipete/agent-scripts',
    cat: 'meta', stars: 7463, img: '',
    desc: '给 agent 用的脚本仓库，主打给 skill 减肥、减上下文开销。skill 装多了开始变慢变贵时来翻翻。',
    tags: ['脚本', '省 Token', '精简']
  },
  {
    id: 'sanyuan0704-sanyuan-skills', name: '三元 Skills', repo: 'sanyuan0704/sanyuan-skills',
    cat: 'meta', stars: 3975, img: '',
    desc: '生产级 skill 集，招牌是代码审查：SOLID、安全、性能、错误处理逐项过。接手别人的代码、要一次彻底 review 时用它。',
    tags: ['代码审查', 'SOLID', '生产级']
  },
  {
    id: 'spacezephyr-skilldeck', name: 'SkillDeck 技控台', repo: 'spacezephyr/skilldeck',
    cat: 'meta', stars: 81, img: '',
    desc: '把本地上百个 skill 变成一面卡片墙：搜索、分类、点一下复制口令贴进 Codex 就能跑，还能把相关 skill 打包成「专家」。skill 多到记不住时用它。',
    tags: ['可视化管理', '卡片墙', '专家包']
  },
  {
    id: 'qufei1993-skills-hub', name: 'Skills Hub', repo: 'qufei1993/skills-hub',
    cat: 'meta', stars: 1861, img: '',
    desc: '装一次、到处同步：跨平台桌面应用，统一管理 agent skill 并同步到你常用的工具和项目。多台机器、多个编辑器来回切时省事。',
    tags: ['同步', '桌面应用', '多工具']
  },
  {
    id: 'backtthefuture-skillmanager', name: 'Skill Hub 管理器', repo: 'backtthefuture/skillmanager',
    cat: 'meta', stars: 76, img: '',
    desc: '黄叔的本地 Web UI：全盘扫描所有 skill、聚合展示、可视化编辑，还带自动版本快照。改坏能回滚，这点比手动翻目录靠谱。',
    tags: ['可视化管理', '版本快照', '全盘扫描']
  },
  {
    id: 'luochang212-skill-zoo', name: 'Skill Zoo', repo: 'luochang212/skill-zoo',
    cat: 'meta', stars: 124, img: '',
    desc: '一站式的桌面 skill 管理工具：看清单、开关、整理，把散落的 skill 收进一个笼子里。装了几十个之后需要它来收拾。',
    tags: ['桌面工具', '管理', '整理']
  },
  {
    id: 'shirenchuang-agentbro', name: 'AgentBro 控制台', repo: 'shirenchuang/agentbro',
    cat: 'meta', stars: 166, img: '',
    desc: 'Mac 上的 agent 桌面控制台：在悬浮窗里处理会话、审批与提问，统一管 Hooks、Skills、MCP、插件和模型供应商。终端窗口开太多的解药。',
    tags: ['桌面控制台', '多 Agent', 'MCP']
  },
  {
    id: 'binghe1980-skill-gardener', name: 'Skill Gardener', repo: 'binghe1980/skill-gardener',
    cat: 'meta', stars: 10, img: '',
    desc: '把 skill 当长期资产养：持续修剪、补测、记录演化。想让一套 skill 用一年还不过时时，需要这种养成机制。',
    tags: ['维护', '演化', '长期']
  },
  {
    id: 'straighttttt-codex-skill-refactor', name: 'Skill 重构', repo: 'straighttttt/codex-skill-refactor',
    cat: 'meta', stars: 6, img: '',
    desc: '只读优先的 skill：先审计现有 skill 的结构与冗余，再动手重构。skill 写长了、逻辑开始打结时用它开刀。',
    tags: ['重构', '审计', '只读优先']
  },
  {
    id: 'wehuman01-aweswitch', name: 'aweswitch', repo: 'Wehuman01/aweswitch',
    cat: 'meta', stars: 28, img: '',
    desc: 'CLI 层面的模型配置切换器：Claude Code、Codex 等工具的 profile 一键换。多账号、多供应商来回切时不用手改配置。',
    tags: ['配置切换', 'CLI', '多供应商']
  },
  {
    id: 'wehuman01-aweshelf', name: 'aweshelf', repo: 'Wehuman01/aweshelf',
    cat: 'meta', stars: 14, img: '',
    desc: '给 shell 会话做书签的 CLI：常用的长路径、长命令存下来随时取。终端里天天重复敲同一串命令时用它。',
    tags: ['CLI', '书签', '效率']
  },
  {
    id: 'wehuman01-awescholar', name: 'awescholar', repo: 'Wehuman01/awescholar',
    cat: 'meta', stars: 8, img: '',
    desc: '自动化的文献发现与整理：按主题扫新论文、去重、归档成清单。追一个方向的进展时不用每天手动刷。',
    tags: ['文献', '自动整理', '科研']
  },
  {
    id: 'nidhinjs-prompt-master', name: 'Prompt Master', repo: 'nidhinjs/prompt-master',
    cat: 'meta', stars: 15577, img: '',
    desc: '给 12 种 AI 工具写对口提示词的 skill，零配置。同一件事要在 Claude、Cursor、Midjourney 之间换个说法时用它。',
    tags: ['提示词', '多工具', '零配置']
  },
  {
    id: 'oil-oil-see-skill', name: 'See 视觉补丁', repo: 'oil-oil/see-skill',
    cat: 'meta', stars: 161, img: '',
    desc: '给不能看图的模型补一双眼睛：图片和视频的识别与分析。用纯文本模型干活、又必须看截图时挂上它。',
    tags: ['视觉', '图片分析', '补能力']
  },
  {
    id: 'vercel-labs-agent-skills', name: 'Vercel Agent Skills', repo: 'vercel-labs/agent-skills',
    cat: 'meta', stars: 33619, img: '',
    desc: 'Vercel 官方 skill 集，偏上线前的检查：部署配置、性能、可访问性。页面要发到线上之前先过一遍。',
    tags: ['Vercel', '上线检查', '官方']
  },
  {
    id: 'aws-agent-toolkit-for-aws', name: 'AWS Agent Toolkit', repo: 'aws/agent-toolkit-for-aws',
    cat: 'meta', stars: 3416, img: '',
    desc: 'AWS 官方支持的 MCP 服务器、skill 与插件集合，让 agent 能真正操作云资源。要在 AWS 上做自动化时从这进。',
    tags: ['AWS', 'MCP', '官方']
  },
  {
    id: 'anthropics-claude-plugins-official', name: 'Claude 官方插件目录', repo: 'anthropics/claude-plugins-official',
    cat: 'pack', stars: 46253, img: '',
    desc: 'Anthropic 亲自维护的 Claude Code 插件目录，质量有底线。装插件前先来这里看官方推荐，比随便搜一个靠谱。',
    tags: ['官方', '插件', '目录']
  },
  {
    id: 'wechatpay-apiv3-wechatpay-skills', name: '微信支付 Skills', repo: 'wechatpay-apiv3/wechatpay-skills',
    cat: 'meta', stars: 372, img: '',
    desc: '微信支付官方 skill：产品选型、示例代码、直接在工程里落地接入代码、接入质量评估、排障。给开发者用，不是给普通用户用的。',
    tags: ['微信支付', '官方', '接入']
  },
  {
    id: 'wecomteam-wecom-cli', name: '企业微信 CLI', repo: 'wecomteam/wecom-cli',
    cat: 'meta', stars: 3307, img: '',
    desc: '企业微信开放平台命令行工具，人和 AI agent 都能在终端里操作企微。要批量处理企微里的消息和资料时用它。',
    tags: ['企业微信', 'CLI', '开放平台']
  },
  {
    id: 'wzdavid-openclaw-desktop', name: 'OpenClaw Desktop', repo: 'wzdavid/openclaw-desktop',
    cat: 'meta', stars: 43, img: '',
    desc: '把 OpenClaw 从终端、配置文件和手工安装里解放出来的桌面工作区。想玩 OpenClaw 又不想折腾环境时从这装。',
    tags: ['OpenClaw', '桌面端', '开箱']
  },
  {
    id: 'turixai-turix-cua', name: 'TuriX CUA', repo: 'turixai/turix-cua',
    cat: 'meta', stars: 3177, img: '',
    desc: '把任意桌面 App 当成 skill 来用：屏幕上点得到的，agent 都能替你操作，微信这类没有 API 的也不例外。',
    tags: ['电脑操作', 'GUI', '无 API']
  },
  {
    id: 'ayghri-i-have-adhd', name: '别埋答案', repo: 'ayghri/i-have-adhd',
    cat: 'meta', stars: 60280, img: '',
    desc: '专治 agent 把结论埋在第三段：强制先给答案、再给过程，输出短且能一眼扫完。受够了绕圈子的回答时装它。',
    tags: ['输出风格', '先给答案', '简洁']
  },
  {
    id: 'code-yeongyu-oh-my-openagent', name: 'Oh My OpenAgent', repo: 'code-yeongyu/oh-my-openagent',
    cat: 'meta', stars: 70738, img: '',
    desc: '一个开箱即用的 agent 增强配置，关键词触发一整套工作流，作者在这上面烧了不少钱试错。想直接抄一套成熟配置时看它。',
    tags: ['配置', '开箱', '工作流']
  },
  {
    id: 'everyinc-compound-engineering-plugin', name: 'Compound Engineering', repo: 'everyinc/compound-engineering-plugin',
    cat: 'pack', stars: 25949, img: '',
    desc: '官方复合工程插件，支持 Claude Code、Codex、Cursor：把「调研—计划—实现—复盘」固化成可复用的命令与子 agent。团队协作时统一节奏。',
    tags: ['插件', '工程流程', '多工具']
  },
  {
    id: 'google-skills', name: 'Google Agent Skills', repo: 'google/skills',
    cat: 'pack', stars: 22553, img: '',
    desc: 'Google 官方出的 agent skill：覆盖 Gemini、Workspace、云服务等产品的正确用法。用 Google 全家桶时配套上，少踩 API 细节。',
    tags: ['官方', 'Google', 'Workspace']
  },
  {
    id: 'composiohq-awesome-claude-skills', name: 'Awesome Claude Skills', repo: 'composiohq/awesome-claude-skills',
    cat: 'pack', stars: 78893, img: '',
    desc: '社区维护的 Claude skill 精选目录，按用途分类还带新手上路说明。想找「有没有人已经做过」时先扫它。',
    tags: ['目录', '精选', '社区']
  },
  {
    id: 'karanb192-awesome-claude-skills', name: 'Awesome Skills 验证集', repo: 'karanb192/awesome-claude-skills',
    cat: 'pack', stars: 583, img: '',
    desc: '另一份 skill 目录，特点是标了「验证过能跑」，50 多个都实际装过。挑工具时用来交叉验证。',
    tags: ['目录', '已验证', '50+']
  },
  {
    id: 'mukul975-anthropic-cybersecurity-skills', name: '网安 Skills 817', repo: 'mukul975/anthropic-cybersecurity-skills',
    cat: 'pack', stars: 35676, img: '',
    desc: '817 个结构化网络安全 skill，映射到主流安全框架，覆盖攻防、合规与应急。做安全相关 agent 时当词典查。',
    tags: ['安全', '817 个', '框架映射']
  },
  {
    id: 'mondaylabos-zhubian-skills', name: '主编 Skills', repo: 'mondaylabos/zhubian-skills',
    cat: 'pack', stars: 3, img: '',
    desc: '做内容创作者「最接地气的主编」：选题判断、稿件修改、发布节奏都有人替你拍板。一个人做号需要第二双眼睛时用。',
    tags: ['内容主编', '选题', '改稿']
  },
  {
    id: 'coreyhaines31-marketingskills', name: 'Marketing Skills', repo: 'coreyhaines31/marketingskills',
    cat: 'business', stars: 58798, img: '',
    desc: '把 AI 变成一支增长团队：CRO、文案、SEO、投放、邮件各有一组 skill。做增长缺人手时按岗位装。',
    tags: ['营销', '增长', 'SEO']
  },
  {
    id: 'slavingia-skills', name: '极简创业 Skills', repo: 'slavingia/skills',
    cat: 'business', stars: 11106, img: '',
    desc: '基于 Sahil Lavingia《极简创业者》的方法论 skill：从小做起、先收钱、别急着融资。一人公司做决策时当参照系。',
    tags: ['创业', '极简', '一人公司']
  },
  {
    id: 'deanpeters-product-manager-skills', name: '产品经理 46 技能', repo: 'deanpeters/product-manager-skills',
    cat: 'business', stars: 7899, img: '',
    desc: '46 个可复用的产品管理技能：从发现需求到定价、路线图，都按成体系的方法拆。PM 日常工作流想标准化时用它。',
    tags: ['产品经理', '46 个', '方法论']
  },
  {
    id: 'phuryn-pm-skills', name: 'PM Skills 市场', repo: 'phuryn/pm-skills',
    cat: 'business', stars: 27729, img: '',
    desc: '100+ 个 PM 向的 skill、命令与插件，覆盖调研、需求、指标、发布。产品团队的「skill 超市」，按角色挑。',
    tags: ['产品', '100+', '插件']
  },
  {
    id: 'raphaelxiao-mck-skills', name: 'McK 商业分析', repo: 'raphaelxiao/mck_skills',
    cat: 'business', stars: 32, img: '',
    desc: '按前麦肯锡顾问《如何快速了解一个行业》里的模型做的技能库：行业拆解、竞争格局、进入判断。接咨询活或做行业研究时用。',
    tags: ['商业分析', '行业研究', '咨询']
  },
  {
    id: 'anthropics-financial-services', name: 'Claude 金融服务业', repo: 'anthropics/financial-services',
    cat: 'business', stars: 41068, img: '',
    desc: 'Anthropic 官方的金融场景 agent、skill 与数据连接器：投行、行研、私募、财富管理。做金融类 agent 时是现成的参考实现。',
    tags: ['金融', '官方', '行研']
  },
  {
    id: 'xbtlin-ai-berkshire', name: 'AI 伯克希尔', repo: 'xbtlin/ai-berkshire',
    cat: 'business', stars: 17031, img: '',
    desc: '价值投资研究框架：巴菲特、芒格、段永平、李录四套方法论加多 Agent 交叉质询。看完一家公司想听反方意见时用它。',
    tags: ['价值投资', '大师方法论', '交叉质询']
  },
  {
    id: 'kangarooking-buffett-letters-skill', name: '巴菲特致股东信', repo: 'kangarooking/buffett-letters-skill',
    cat: 'business', stars: 110, img: '',
    desc: '把 60 多年致股东信拆成 20 个可单独触发的判断模块：该追还是该跑、护城河到底在哪。不是读书摘要，是决策工具。',
    tags: ['价值投资', '判断模块', '巴菲特']
  },
  {
    id: 'kangarooking-poor-charlies-almanack-skill', name: '穷查理宝典', repo: 'kangarooking/poor-charlies-almanack-skill',
    cat: 'business', stars: 47, img: '',
    desc: '把芒格的思维方法拆成 12 个判断模块：逆向思考、能力圈、激励机制误判。做重要决策前跑一遍，比凭直觉靠谱。',
    tags: ['芒格', '决策', '思维模型']
  },
  {
    id: 'kangarooking-no-rules-rules-skill', name: 'No Rules Rules', repo: 'kangarooking/no-rules-rules-skill',
    cat: 'business', stars: 15, img: '',
    desc: '把网飞「自由与责任」的组织设计拆成 10 个管理模块：该不该留「差不多够用」的人、反馈怎么给。带团队遇到制度问题时用它。',
    tags: ['组织设计', '管理', '网飞']
  },
  {
    id: 'handsomestwei-patent-disclosure-skill', name: '中国专利 Skill', repo: 'handsomestwei/patent-disclosure-skill',
    cat: 'business', stars: 13000, img: '',
    desc: '专利点挖掘与交底书撰写（发明、实用、外观），还能通俗解读专利、嗅探政策动向、辅助答复审查意见。要报专利但不会写交底书时用它。',
    tags: ['专利', '交底书', '审查答复']
  },
  {
    id: 'shengjidaguai-china-goutoujunshi', name: '狗头军师', repo: 'shengjidaguai-china/goutoujunshi',
    cat: 'knowledge', stars: 9285, img: '',
    desc: '先接住情绪、再分析关系、最后给可执行策略的对话 skill，内置心理、法律、家庭与性学知识库。情感问题想要一个不敷衍的第二意见时用。',
    tags: ['情感', '策略', '知识库']
  },
  {
    id: 'tt-a1i-archify', name: 'Archify 架构图', repo: 'tt-a1i/archify',
    cat: 'diagram', stars: 94016, img: '',
    desc: '一句话或一段代码变成可点击、能交互的架构图，不是静态截图。要讲清「系统怎么分层、数据怎么流」时，比手画 Visio 快。',
    tags: ['架构图', '交互', '一句话']
  },
  {
    id: 'earthtojake-text-to-cad', name: 'Text to CAD', repo: 'earthtojake/text-to-cad',
    cat: 'design', stars: 25660, img: '',
    desc: '用 AI 直接设计实体产品并输出可加工的 CAD 模型。做硬件外观、结构件草图时，把想法变成能交付给工厂的文件。',
    tags: ['CAD', '3D', '硬件']
  },
  {
    id: 'narcooo-inkos', name: 'InKos 故事创作', repo: 'narcooo/inkos',
    cat: 'writing', stars: 11012, img: '',
    desc: '面向小说、剧本、翻译和互动叙事的故事创作 agent：人物、大纲、章节推进都有流程。写长篇时不怕写到一半散架。',
    tags: ['小说', '剧本', '长文']
  },
  {
    id: 'spacezephyr-pm-product-describer', name: '六维产品描述', repo: 'SpaceZephyr/pm-product-describer',
    cat: 'business', stars: 17, img: '',
    desc: '从六个维度逼你把产品说清楚：给谁、解决什么、为什么是你。写官网首屏、BP 摘要素材时，先用它把话讲明白。',
    tags: ['产品描述', '定位', 'BP']
  },
  {
    id: 'bigdata-dashboard', name: '数据大屏生成器', repo: 'AragornZJF/bigdata-dashboard-skill',
    cat: 'diagram', stars: 20, img: 'AragornZJF~bigdata-dashboard-skill.webp', fit: 'contain',
    desc: 'Excel 或 JSON 直接渲染成数据大屏：15 套行业模板（药企、电厂、智慧城市、新能源……），ECharts 九类组件，产物是单个 HTML 文件，双击就能投屏，断网也能放。',
    tags: ['数据大屏', 'ECharts', '单文件 HTML']
  }
,
  {
    id: 'handraw-style', name: '手绘风格提示词库', repo: 'yang0/handraw-style',
    cat: 'image', stars: 7221, img: 'yang0~handraw-style.webp',
    desc: '365 种手绘与写实画风、170 种排版图型、36 种单色主题，全部编号化。不用再跟模型解释「文艺一点」，报个编号加主题，直接拿到中英双语出图提示词。',
    tags: ['手绘风格', '提示词库', '排版图型']
  }
,
  {
    id: 'app-logo-design', name: 'App Logo 设计', repo: 'simple0926/app-logo-design',
    cat: 'image', stars: 2, img: 'simple0926~app-logo-design.webp',
    desc: '从品牌主张倒推 App 图标：先定陌生人该怎样理解产品，再从六类视觉方向（拟物、扁平、字标、渐变、立体、插画）里挑 1–3 种，最后出 Android / iOS 双平台资源包。',
    tags: ['App 图标', '品牌主张', '双平台交付']
  }
,
  {
    id: 'dm-gzh-cover', name: 'DM 公众号封面', repo: 'xxtdxshine/DM-gzh-cover',
    cat: 'image', stars: 0, img: 'xxtdxshine~DM-gzh-cover.webp',
    desc: '给公众号名称和完整标题，自动从 5 张 Pexels 候选里选图、向左自然扩图，再按语义排两行或三行中文标题，出 1080×460 摄影风封面，并留版本与素材来源。',
    tags: ['公众号封面', '摄影风', '自动选图']
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
window.UPS_FETCHED = '2026-11-08';
window.UPS = {
  'addsumtech/slides_maker': ['2026-11-05', '6.1.0', '2026-10-31'],
  'addyosmani/agent-skills': ['2026-11-01', '0.6.15', '2026-10-31'],
  'adrianpunk/Punk-IP': ['2026-11-04', '', ''],
  'adrianpunk/punk-posters': ['2026-11-04', 'v2.0.0', '2026-09-10'],
  'affaan-m/ecc': ['2026-11-06', 'v2.2.3', '2026-10-01'],
  'Agents365-ai/drawio-skill': ['2026-11-06', 'v3.4.4', '2026-11-06'],
  'aiolosking/english-textbook-reader': ['2026-09-13', '', ''],
  'aiolosking/podcast-reflection-publisher': ['2026-09-13', '', ''],
  'alchaincyf/darwin-skill': ['2026-09-18', '', ''],
  'alchaincyf/hermes-agent-orange-book': ['2026-10-20', '', ''],
  'alchaincyf/huashu-art-motion': ['2026-10-16', 'v1.2.0', '2026-10-16'],
  'alchaincyf/huashu-bird-sticker': ['2026-11-07', 'v2.2.0', '2026-11-05'],
  'alchaincyf/huashu-chrome': ['2026-10-13', '1.3.0', '2026-10-13'],
  'alchaincyf/huashu-design': ['2026-11-04', 'v3.2.0', '2026-11-04'],
  'alchaincyf/huashu-excel': ['2026-11-04', 'v1.1.0', '2026-11-04'],
  'alchaincyf/huashu-icon-set': ['2026-10-13', 'v1.0.0', '2026-10-13'],
  'alchaincyf/huashu-md-html': ['2026-10-13', 'v1.0.0', '2026-10-13'],
  'alchaincyf/huashu-motion': ['2026-10-22', 'v0.3.1', '2026-10-22'],
  'alchaincyf/huashu-report': ['2026-10-13', 'v1.0.0', '2026-10-13'],
  'alchaincyf/huashu-skills': ['2026-11-02', '', ''],
  'alchaincyf/huashu-slide-doubao': ['2026-10-13', 'v1.0.0', '2026-10-13'],
  'alchaincyf/nuwa-skill': ['2026-11-03', 'v1.1.0', '2026-11-03'],
  'alchaincyf/zhangxuefeng-skill': ['2026-10-13', 'v1.0.0', '2026-10-13'],
  'alibaba-flyai/flyai-skill': ['2026-11-02', '', ''],
  'allweonedev/presentation-ai': ['2026-06-05', '', ''],
  'anionex/banana-slides': ['2026-11-07', '0.9.0', '2026-09-08'],
  'anthropics/claude-plugins-official': ['2026-11-06', '', ''],
  'anthropics/financial-services': ['2026-10-28', '', ''],
  'anthropics/k12-teacher-skills': ['2026-10-14', '', ''],
  'anthropics/skills': ['2026-11-06', '', ''],
  'AragornZJF/bigdata-dashboard-skill': ['2026-10-30', '', ''],
  'aws/agent-toolkit-for-aws': ['2026-11-06', '', ''],
  'ayghri/i-have-adhd': ['2026-10-11', 'v0.4.1', '2026-10-19'],
  'Backtthefuture/huangshu': ['2026-08-03', 'v0.3.0', '2026-04-11'],
  'backtthefuture/skillmanager': ['2026-04-16', '', ''],
  'binggandata/bggg-skill-taotie': ['2026-05-03', '', ''],
  'binggandata/bggg-skills': ['2026-08-13', '', ''],
  'binghe1980/skill-gardener': ['2026-07-04', '', ''],
  'blader/humanizer': ['2026-10-28', 'v3.1.0', '2026-09-28'],
  'bradautomates/claude-video': ['2026-09-25', 'v0.3.2', '2026-09-25'],
  'browser-act/skills': ['2026-11-04', '', ''],
  'brycewang-stanford/many-ppt-skills': ['2026-09-05', '', ''],
  'bvb6417/ppt-studio': ['2026-10-16', '', ''],
  'career-ops-hq/career-ops': ['2026-11-07', 'v0.17.0', '2026-11-05'],
  'cathrynlavery/diagram-design': ['2026-11-06', '', ''],
  'chuspeeism/dashi-ppt-skill': ['2026-11-06', '', ''],
  'Cocoon-AI/architecture-diagram-generator': ['2026-05-13', '', ''],
  'code-yeongyu/oh-my-openagent': ['2026-11-08', 'v5.1.64', '2026-11-07'],
  'coleam00/excalidraw-diagram-skill': ['2026-03-01', '', ''],
  'comeonzhj/auto-redbook-skills': ['2026-08-13', '', ''],
  'composiohq/awesome-claude-skills': ['2026-07-24', '', ''],
  'conardli/garden-skills': ['2026-10-25', 'v0.1.0', '2026-10-11'],
  'conorbronsdon/avoid-ai-writing': ['2026-11-05', 'v3.38.0', '2026-10-15'],
  'coreyhaines31/marketingskills': ['2026-11-06', 'v2.14.2', '2026-11-06'],
  'dacnay816y62-hub/photo-revival': ['2026-09-05', '', ''],
  'deanpeters/product-manager-skills': ['2026-10-16', 'v0.84', '2026-08-10'],
  'debpalash/voicestudio': ['2026-11-08', 'v0.5.8', '2026-11-07'],
  'dmoshehun-prog/learn-from-materials': ['2026-10-19', '1.1.0', '2026-10-19'],
  'dontbesilent2025/dbskill': ['2026-11-08', 'v3.3.0', '2026-11-08'],
  'earthtojake/text-to-cad': ['2026-11-08', 'v0.11.1', '2026-11-08'],
  'egonex-ai/understand-anything': ['2026-11-07', 'v2.9.0', '2026-07-10'],
  'einsia/browser-bc': ['2026-07-13', 'v0.1.9', '2026-06-28'],
  'elayadesign/ai-design-skills': ['2026-11-01', '', ''],
  'emilkowalski/skills': ['2026-11-04', '', ''],
  'everettfish/ip_illustration_for_yourself': ['2026-08-31', '', ''],
  'everyinc/compound-engineering-plugin': ['2026-11-08', 'v3.37.0', '2026-11-08'],
  'eze-is/web-access': ['2026-10-14', 'v2.6.0', '2026-10-14'],
  'freestylefly/awesome-gpt-image-2': ['2026-11-05', 'v1.0.4', '2026-05-08'],
  'garrytan/gstack': ['2026-11-08', 'v1.97.0.0', '2026-11-07'],
  'geekjourneyx/claude-design-card': ['2026-05-27', '', ''],
  'geeklee/srt-whiteboard-animation': ['2026-07-27', 'v1.0.0', '2026-07-27'],
  'gnipbao/minimax-h3-video-reverse-skill': ['2026-10-02', '', ''],
  'gnipbao/story-to-handdrawn-video': ['2026-09-22', '', ''],
  'google/skills': ['2026-11-07', '', ''],
  'GordenSun/GordenPPTSkill': ['2026-06-22', '', ''],
  'gordensun/gordensuperpptskills': ['2026-06-07', '', ''],
  'Graphify-Labs/graphify': ['2026-11-08', '0.9.104', '2026-11-08'],
  'handsomestwei/patent-disclosure-skill': ['2026-11-07', '', ''],
  'hardikpandya/stop-slop': ['2026-03-17', '', ''],
  'Hchen1218/heytea-style': ['2026-09-04', 'v2.0.0', '2026-08-25'],
  'helloianneo/ian-xiaohei-illustrations': ['2026-10-27', 'v1.0.0', '2026-05-28'],
  'hexiaofeier/baojie': ['2026-10-30', '2026.10.30', '2026-10-30'],
  'hexiaofeier/tanzi': ['2026-09-07', '', ''],
  'heygen-com/hyperframes': ['2026-11-08', 'v0.9.23', '2026-11-08'],
  'hjxccc/nowledge': ['2026-09-15', '', ''],
  'hugohe3/ppt-master': ['2026-11-07', 'v6.8.0', '2026-10-30'],
  'humanlayer/skills': ['2026-11-01', '', ''],
  'ibelick/ui-skills': ['2026-11-07', 'v0.2.3', '2026-06-22'],
  'icip-cas/pptagent': ['2026-11-02', 'v1.1.38', '2026-09-20'],
  'idiotLeoLYJ/Daliu-Awesome-Skills': ['2026-11-01', '', ''],
  'imraywang/wewrite': ['2026-11-02', 'v4.2.1', '2026-07-16'],
  'iotate/photo-story': ['2026-10-23', '', ''],
  'irenerachel/ebook-maker-skill': ['2026-04-19', '', ''],
  'irenerachel/xiaohongshu-layout-factory-skill': ['2026-08-23', '', ''],
  'isjiamu/gzh-design-skill': ['2026-10-21', 'v1.0.0', '2026-07-08'],
  'jackwener/opencli': ['2026-11-07', 'v2.0.3', '2026-11-07'],
  'jackwener/wechat-article-to-markdown': ['2026-03-22', 'v0.1.0', '2026-03-04'],
  'jakubkrehel/make-interfaces-feel-better': ['2026-08-29', '', ''],
  'jamesrochabrun/skills': ['2026-01-14', '2.1.1', '2026-01-14'],
  'jcodesmore/ai-website-cloner-template': ['2026-10-05', 'v0.6.1', '2026-10-05'],
  'jesseovo/last30days-skill-cn': ['2026-11-03', 'v4.0.0', '2026-10-05'],
  'JimLiu/baocut': ['2026-11-08', '3.16.4', '2026-11-07'],
  'JimLiu/baoyu-design': ['2026-11-08', 'v2.12.1', '2026-11-08'],
  'JimLiu/baoyu-skills': ['2026-11-06', 'v2.5.2', '2026-06-18'],
  'jitOffice/jit-motion': ['2026-09-20', '', ''],
  'joeseesun/qiaomu-markdown-proxy': ['2026-08-05', 'v2.1.0', '2026-08-05'],
  'joeseesun/qiaomu-opencli-skills': ['2026-04-09', '', ''],
  'JuliusBrussee/caveman': ['2026-11-08', '4.1.0', '2026-11-08'],
  'jzocb/writing-style-skill': ['2026-03-24', '', ''],
  'kaankiziltug/logo-design-skill': ['2026-11-06', 'v1.4.5', '2026-10-20'],
  'kangarooking/buffett-letters-skill': ['2026-04-17', '', ''],
  'kangarooking/cangjie-skill': ['2026-10-02', 'v2.5.0', '2026-09-13'],
  'kangarooking/director-skills': ['2026-10-20', '', ''],
  'kangarooking/kangarooking-skills': ['2026-11-04', '', ''],
  'kangarooking/no-rules-rules-skill': ['2026-04-17', '', ''],
  'kangarooking/poor-charlies-almanack-skill': ['2026-04-17', '', ''],
  'kangarooking/x-growth-skills': ['2026-07-14', '', ''],
  'karanb192/awesome-claude-skills': ['2026-10-29', '', ''],
  'kepano/obsidian-skills': ['2026-09-15', '', ''],
  'kingkk469/creator-distiller': ['2026-08-22', '', ''],
  'KKKKhazix/AIHOT': ['2026-11-08', '', ''],
  'KKKKhazix/human-writing': ['2026-11-08', '1.2.0', '2026-11-08'],
  'KKKKhazix/khazix-skills': ['2026-11-08', 'v1.2.0', '2026-11-08'],
  'kunchenguid/no-mistakes': ['2026-11-08', 'v1.111.0', '2026-11-05'],
  'larashero3-dotcom/lieflat-gongwen': ['2026-11-03', '', ''],
  'larashero3-dotcom/writing-dna-skill': ['2026-11-05', '', ''],
  'larksuite/cli': ['2026-11-05', 'v1.0.99', '2026-11-04'],
  'LearnPrompt/luban-skill': ['2026-07-10', 'v2.1.0', '2026-07-10'],
  'Leonxlnx/taste-skill': ['2026-11-07', 'v2.5.1', '2026-11-07'],
  'lewislulu/html-ppt-skill': ['2026-09-14', '', ''],
  'liamgvchi/gc-minimal-zine-poster': ['2026-08-13', 'v0.3.1', '2026-08-13'],
  'liangdabiao/liurun-bookwriter-skills': ['2026-07-11', '', ''],
  'liangdabiao/smy-seedance-storyboard': ['2026-10-08', '', ''],
  'lijigang/ljg-skill-roundtable': ['2026-03-24', '', ''],
  'lijigang/ljg-skill-xray-book': ['2026-02-10', '', ''],
  'lijigang/ljg-skill-xray-paper': ['2026-02-26', '', ''],
  'lijigang/ljg-skills': ['2026-11-02', '', ''],
  'likaku/mck-ppt-design-skill': ['2026-11-03', 'v2.4.1', '2026-11-03'],
  'liucongg/liucong-skills': ['2026-10-15', '', ''],
  'liyue-aigc/seedance-2-5-video-director': ['2026-08-26', 'v1.0.0', '2026-08-18'],
  'liyupi/ai-promo-video-maker': ['2026-10-09', '', ''],
  'liyupi/codefather': ['2026-07-11', '', ''],
  'liyupi/yupi-skill': ['2026-04-09', '', ''],
  'logamee/logamee-film-forge': ['2026-10-09', '', ''],
  'lovstudio/any2pdf': ['2026-10-31', '', ''],
  'luochang212/skill-zoo': ['2026-11-08', 'v0.4.7', '2026-11-08'],
  'mattpocock/skills': ['2026-10-31', 'v1.3.2', '2026-10-29'],
  'MemTensor/MemOS': ['2026-11-04', 'v2.0.21', '2026-11-04'],
  'mengke-wang/xiaohongshu-ai-workbench': ['2026-08-07', 'v0.2.0', '2026-08-04'],
  'microsoft/markitdown': ['2026-11-07', '0.1.9', '2026-10-21'],
  'microsoft/skill-recorder': ['2026-11-02', 'v0.8.0', '2026-11-02'],
  'microsoft/skillopt': ['2026-11-07', 'v0.2.0', '2026-07-02'],
  'MiniMax-AI/skills': ['2026-04-18', '', ''],
  'mizzlelover/gongwen-gbt9704-skill': ['2026-09-13', 'v2.0.0', '2026-09-11'],
  'mliu98/awesome-human-distillation': ['2026-11-05', '', ''],
  'MondayLabOS/larkwing-cli': ['2026-10-03', '', ''],
  'mondaylabos/magazine-visuals': ['2026-08-05', '', ''],
  'mondaylabos/zhubian-skills': ['2026-07-28', '', ''],
  'morgensonne/editdeck': ['2026-04-16', '', ''],
  'morluto/rea': ['2026-11-08', 'v6.8.0', '2026-10-25'],
  'mukul975/anthropic-cybersecurity-skills': ['2026-08-31', 'v1.3.0', '2026-06-22'],
  'multica-ai/andrej-karpathy-skills': ['2026-04-20', '', ''],
  'mvanhorn/last30days-skill': ['2026-11-05', 'v3.31.0', '2026-10-27'],
  'narcooo/inkos': ['2026-10-24', 'v1.8.0', '2026-08-17'],
  'nesquena/hermes-webui': ['2026-11-07', 'v0.52.653', '2026-11-07'],
  'netease/skills': ['2026-03-31', '', ''],
  'nextlevelbuilder/ui-ux-pro-max-skill': ['2026-11-07', 'v2.15.0', '2026-08-13'],
  'nexu-io/html-video': ['2026-06-21', '', ''],
  'nexu-io/motion-anything': ['2026-07-07', '0.1.0', '2026-07-07'],
  'nexu-io/open-design': ['2026-11-06', '0.27.0', '2026-11-04'],
  'nicobailon/visual-explainer': ['2026-11-05', 'v0.15.0', '2026-11-05'],
  'nicotine00/blinkoo-vibe-daily': ['2026-10-13', '', ''],
  'nidhinjs/prompt-master': ['2026-10-22', '', ''],
  'ningzimu/codex-ppt-skill': ['2026-10-13', 'v0.6.0', '2026-09-12'],
  'nolangz/pixel2motion': ['2026-08-21', '', ''],
  'norman-bury/research-writing-skill': ['2026-06-10', '', ''],
  'Nutlope/hallmark': ['2026-11-05', '', ''],
  'nuyoah-ai-works/nuyoah-xiezhen-prompt': ['2026-08-26', 'v1.1.0', '2026-08-26'],
  'obra/superpowers': ['2026-11-03', 'v7.0.2', '2026-11-03'],
  'oil-oil/beautify-github-readme': ['2026-10-04', '', ''],
  'oil-oil/codex-team-mode': ['2026-10-01', '', ''],
  'oil-oil/draw-ui': ['2026-10-04', '', ''],
  'oil-oil/git-ship': ['2026-09-10', '', ''],
  'oil-oil/oil-cover': ['2026-11-07', '', ''],
  'oil-oil/oil-html': ['2026-09-10', '', ''],
  'oil-oil/oil-ppt': ['2026-10-04', '', ''],
  'oil-oil/oil-tone': ['2026-09-23', '', ''],
  'oil-oil/oil-visual': ['2026-09-25', '', ''],
  'oil-oil/screen-studio-editor': ['2026-09-21', '', ''],
  'oil-oil/see-skill': ['2026-09-10', '', ''],
  'oil-oil/video-publisher-skill': ['2026-10-14', '', ''],
  'op7418/guizang-material-illustration': ['2026-07-07', '', ''],
  'op7418/guizang-ppt-skill': ['2026-10-30', 'v1.1.0', '2026-05-15'],
  'op7418/guizang-product-video-skill': ['2026-10-09', '', ''],
  'op7418/guizang-social-card-skill': ['2026-10-30', '', ''],
  'op7418/guizang-sports-skill': ['2026-08-09', '', ''],
  'op7418/Humanizer-zh': ['2026-09-23', '', ''],
  'op7418/logo-generator-skill': ['2026-04-15', '', ''],
  'op7418/NanoBanana-PPT-Skills': ['2026-01-19', '', ''],
  'opendcai/paper2any': ['2026-08-31', '', ''],
  'opensensenova/sensenova-6.8-code2video': ['2026-10-27', '', ''],
  'OpenSenseNova/SenseNova-Skills': ['2026-11-03', 'v2026.10', '2026-10-29'],
  'orange2ai/orange-line-illustration': ['2026-06-15', '', ''],
  'orz-ai/hot_news': ['2026-09-09', '', ''],
  'Panniantong/Agent-Reach': ['2026-11-08', 'v1.6.1', '2026-11-01'],
  'pbakaus/impeccable': ['2026-11-08', '4.8.1', '2026-11-08'],
  'phuryn/pm-skills': ['2026-10-29', 'v2.2.0', '2026-10-10'],
  'pskoett/self-improving-agent': ['2026-10-22', '', ''],
  'qqhkx2027/qiuqiu-travel-image': ['2026-09-06', '', ''],
  'qufei1993/skills-hub': ['2026-11-01', 'v1.1.0', '2026-11-01'],
  'raphaelxiao/mck_skills': ['2026-07-19', '', ''],
  'redfox-data/redfox-community': ['2026-11-06', '', ''],
  'regan-sun/refining-transcripts-skill': ['2026-09-22', '', ''],
  'regan-sun/toastmasters-vertical-infographic': ['2026-09-22', '', ''],
  'remotion-dev/skills': ['2026-11-05', '', ''],
  'Russell-cell/PPT-as-code': ['2026-04-14', '', ''],
  's1dashu/ip-as-logo-skill': ['2026-11-06', '', ''],
  's2dongman/knowledge-asset-health-check': ['2026-09-12', 'v1.0.5', '2026-09-07'],
  'sanyuan0704/sanyuan-skills': ['2026-05-11', '', ''],
  'SaSaLiurong/edison': ['2026-06-14', 'v3.0', '2026-06-14'],
  'shengjidaguai-china/goutoujunshi': ['2026-09-15', '', ''],
  'shirenchuang/agentbro': ['2026-08-03', 'v3.1.0', '2026-08-03'],
  'simple0926/app-logo-design': ['2026-11-07', '', ''],
  'slavingia/skills': ['2026-04-14', '', ''],
  'sligter/landppt': ['2026-11-08', 'v0.5.1', '2026-10-25'],
  'smartschoolai/ai-to-pptx': ['2026-06-12', 'V0.2', '2025-02-10'],
  'spacezephyr/creator-buddy': ['2026-08-26', '', ''],
  'SpaceZephyr/design-buddy': ['2026-07-06', '', ''],
  'spacezephyr/heart-sticker-imagegen-skill': ['2026-08-21', '', ''],
  'spacezephyr/map-motion': ['2026-10-09', '', ''],
  'SpaceZephyr/personal-site-builder': ['2026-07-31', '', ''],
  'SpaceZephyr/pm-product-describer': ['2026-04-14', '', ''],
  'SpaceZephyr/pm-skills': ['2026-07-09', '', ''],
  'SpaceZephyr/read-buddy': ['2026-07-06', '', ''],
  'SpaceZephyr/skill-productizer': ['2026-07-22', '', ''],
  'spacezephyr/skilldeck': ['2026-07-31', '', ''],
  'SpaceZephyr/space-handdrawn-motion-video': ['2026-10-22', 'v0.2.0', '2026-10-21'],
  'spacezephyr/space-multi-design-ppt': ['2026-07-07', '', ''],
  'steipete/agent-scripts': ['2026-10-30', '0.12.0', '2026-07-17'],
  'straighttttt/codex-skill-refactor': ['2026-08-28', 'v1.0.0', '2026-08-28'],
  'tait-tt/tait-crt-interface-skill': ['2026-08-11', '', ''],
  'tanshilongmario/visual-memory-translator-skill': ['2026-08-27', '', ''],
  'tanweai/pua': ['2026-09-09', 'v3.5.1', '2026-09-09'],
  'thedotmack/claude-mem': ['2026-11-07', 'v15.12.0', '2026-11-07'],
  'thu-maic/openmaic': ['2026-11-06', 'v1.4.1', '2026-11-06'],
  'titanwings/distilly': ['2026-10-13', '', ''],
  'tjxj/z-skills': ['2026-11-07', '', ''],
  'tt-a1i/archify': ['2026-10-31', 'v3.2.0', '2026-10-19'],
  'turixai/turix-cua': ['2026-09-14', 'v0.4', '2026-03-06'],
  'tw93/kami': ['2026-11-08', 'V1.20.0', '2026-10-29'],
  'unnoo/zsxq-skill': ['2026-11-06', 'v2.2.0', '2026-08-28'],
  'vercel-labs/agent-browser': ['2026-11-08', 'v0.41.2', '2026-11-03'],
  'vercel-labs/agent-skills': ['2026-10-27', '', ''],
  'vercel-labs/skills': ['2026-11-06', 'v1.7.6', '2026-11-03'],
  'vincentwei1021/video-shotcraft': ['2026-10-29', '', ''],
  'vincentwei1021/video-talkcraft': ['2026-10-12', '', ''],
  'virgiliojr94/book-to-skill': ['2026-11-03', 'v1.4.0', '2026-08-10'],
  'vividvictor/transparent-image-generator': ['2026-06-11', '', ''],
  'VoltAgent/awesome-design-md': ['2026-10-28', '', ''],
  'wanikua/danghuangshang': ['2026-05-22', 'v3.6.1', '2026-03-30'],
  'waterbrojx/water-koubo': ['2026-08-18', 'v1.0.0', '2026-08-18'],
  'wechatpay-apiv3/wechatpay-skills': ['2026-11-02', '', ''],
  'wecomteam/wecom-cli': ['2026-10-29', '', ''],
  'Wehuman01/awescholar': ['2026-10-01', 'v0.3.9', '2026-10-01'],
  'Wehuman01/aweshelf': ['2026-08-31', 'v0.2.1', '2026-08-07'],
  'Wehuman01/aweskill': ['2026-09-13', 'v0.4.8', '2026-09-13'],
  'Wehuman01/aweswitch': ['2026-09-17', 'v0.7.1', '2026-09-17'],
  'wheresryan22/anatomy': ['2026-10-18', '1.1', '2026-10-12'],
  'wshuyi/x-article-publisher-skill': ['2026-01-25', '', ''],
  'wuyoscar/jev-skill': ['2026-11-05', 'v0.2.0', '2026-09-21'],
  'wyuzhi/qisi-video-remix': ['2026-09-11', '', ''],
  'wzdavid/openclaw-desktop': ['2026-06-19', 'v0.4.4', '2026-06-20'],
  'wzdavid/thinkwiki': ['2026-07-13', 'v1.7.3', '2026-07-13'],
  'xbtlin/ai-berkshire': ['2026-11-04', 'v1.0.0', '2026-04-07'],
  'yang0/handraw-style': ['2026-11-08', '', ''],
  'xiaohuailabs/tacit-mining': ['2026-04-08', '', ''],
  'xxtdxshine/DM-gzh-cover': ['2026-10-22', '', ''],
  'yaojingang/yao-open-skills': ['2026-10-14', '', ''],
  'yizhiyanhua-ai/fireworks-tech-graph': ['2026-10-21', 'v1.2.0', '2026-07-17'],
  'youmind-openlab/skills': ['2026-06-05', '', ''],
  'YuppyChen/ai-wechat': ['2026-03-19', '', ''],
  'zarazhangrui/beautiful-feishu-whiteboard': ['2026-06-11', '', ''],
  'zarazhangrui/beautiful-html-templates': ['2026-06-09', '', ''],
  'zarazhangrui/follow-builders': ['2026-11-08', '', ''],
  'zarazhangrui/frontend-slides': ['2026-06-23', 'v2.1.0', '2026-05-26'],
  'zeejay0/gathered-scenes-zine-skill': ['2026-09-03', '', ''],
  'ZeroxZhang/huashu-bookwriter': ['2026-04-12', '', ''],
  'zeroxzhang/md2book': ['2026-04-10', '', ''],
  'zhaoxuya520/reverse-skill': ['2026-09-22', 'v1.0.1', '2026-08-08'],
  'zhouwei713/luobo-ppt': ['2026-10-22', '', ''],
  'zhouwei713/title-matrix': ['2026-09-14', '', ''],
  'ziguishian/xhs-visual-director-skill': ['2026-07-03', '', ''],
  'zzzlc0405/photo-abstract-editorial': ['2026-08-19', '', '']
};
