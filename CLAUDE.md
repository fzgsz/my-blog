# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

静态个人博客 + 作品集，纯 HTML/CSS/JS 无框架，运行于 Nginx / 腾讯云 CVM。

## 开发命令

```bash
# 本地预览
start index.html

# 部署到服务器（SCP 上传到腾讯云 CVM）
scp -r *.html css/ js/ posts/ assets/ root@124.220.97.113:/usr/share/nginx/html/

# 查看 git 状态并推送
cd D:/Projects/my-blog && git status && git push
```

## 架构

### 页面结构

- `index.html` — 首页（Hero + 社交链接 + 最新3篇文章 + 搜索/标签 + 技能卡片）
- `post.html?slug=xxx` — 文章详情页（fetch markdown → marked.js 渲染）
- `about.html` — 关于页（终端 JSON 风格 + 博客介绍）

### JS 模块

- `js/main.js` — **必须先加载**。定义全局变量 `POSTS_INDEX`（文章索引数组）、主题切换、导航、打字机效果、首页渲染（`renderHomePage`、`renderPosts`）、标签过滤（`filterByTag`）、滚动渐入动画
- `js/search.js` — 依赖 main.js。搜索输入监听，调用 `performSearch()`，内部使用 `POSTS_INDEX`、`currentTag`、`renderPosts`
- `js/markdown.js` — 依赖 main.js。从 URL `?slug=` 读取参数，通过 `POSTS_INDEX` 获取文章元信息，fetch `.md` 文件后解析 front matter 并用 `marked.js` 渲染

### 文章管理

所有文章放在 `posts/` 目录，Markdown 格式，支持 front matter：

```markdown
---
title: 文章标题
date: 2026-05-06
tags: [标签1, 标签2]
---

文章内容...
```

新增文章步骤（推荐用脚本，一条命令搞定）：
```bash
./new-post.sh "文章标题" "标签1,标签2" [slug]
```
手动方式：
1. 在 `posts/` 下创建 `slug.md`
2. 在 `js/main.js` 的 `POSTS_INDEX` 数组添加对应条目（slug、title、date、tags、excerpt）

### CSS 变量（主题色）

暗色/亮色主题通过 `[data-theme]` 选择器切换，所有颜色集中在一组 CSS 变量中：

- `--accent`：主色 `#638fd9`（蓝紫）
- `--accent2`：辅色 `#4ecca3`（青绿）
- `--bg` / `--surface` / `--surface2`：背景层级
- `--border` / `--border-hover`：边框
- `--text` / `--muted`：文字层级

修改主题色只需改 `:root` 和 `[data-theme="light"]` 中的变量值。

### 外部依赖

- **marked.js**（CDN）— post.html 中加载，用于 Markdown 渲染
- **Google Fonts**（Syne + JetBrains Mono）— index.html 中加载，GFW 环境下自动回退系统字体
- **Font Awesome 6.4**（CDN）— 图标

## 跨页面加载链

```
index.html:  main.js → search.js
post.html:   main.js → marked.js (CDN) → markdown.js
about.html:  main.js
```

`main.js` 定义了 `POSTS_INDEX`、`renderPosts`、`currentTag` 等全局变量，后续脚本依赖它们。

## 已部署

- **线上地址**：`http://124.220.97.113/`（腾讯云 CVM，Nginx/1.20.1）
- **GitHub**：`https://github.com/fzgsz/my-blog`（HTTPS，需代理 `127.0.0.1:7897`）
