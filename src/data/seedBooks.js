export const seedBooks = [
  {
    id: 'bk-tech-ai',
    title: 'AI 写作设计指南',
    author: '林呈',
    category: '创作方法',
    status: '草稿',
    favorite: true,
    tags: ['AI', '写作', '方法论'],
    updatedAt: '2025-11-01T12:12:00.000Z',
    summary: '结合有道云笔记的知识工作流，构建适配 AIGC 时代的图书写作范式。',
    content: `# AI 写作设计指南

## 核心目标
- 构建可重复的 AI 写作链路
- 梳理提示模板与知识图谱

## 操作清单
1. 定义读者画像
2. 拆解章节粒度
3. 准备知识素材
4. 设定提示

> 「写书即设计体验」`,
  },
  {
    id: 'bk-prod-note',
    title: '知识花园：第二大脑的搭建术',
    author: 'Lydia',
    category: '知识管理',
    status: '在写',
    favorite: false,
    tags: ['知识库', 'PKM'],
    updatedAt: '2025-10-24T09:30:00.000Z',
    summary: '从采集、整理到发布的全链路方法论，强调「种子-枝叶-果实」的内容演化路径。',
    content: `# 知识花园

### 三层结构
- 种子：灵感碎片
- 枝叶：主题文章
- 果实：系统出版

### 工具栈
Obsidian / 有道云 / GitHub / Notion

### 节奏建议
- 每日晨间回顾
- 每周主题梳理
- 每月发布复盘`,
  },
  {
    id: 'bk-edit-ux',
    title: '编辑器体验实战手记',
    author: '七里',
    category: '产品设计',
    status: '已成稿',
    favorite: true,
    tags: ['UX', '编辑器', '前端'],
    updatedAt: '2025-09-15T15:45:00.000Z',
    summary: '记录构建现代编辑器时的交互模式、性能优化与协作策略，聚焦中文创作者体验。',
    content: `# 编辑器体验实战手记

## 指南
1. 始终保持输入区+预览区同步
2. 提供快捷指令 / 命令面板
3. 跟踪文档结构（大纲）

## 性能提示
- 虚拟列表渲染章节
- 延迟加载复杂组件
- Service Worker 缓存模版`,
  },
];
