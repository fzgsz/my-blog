---
title: 用 DeepSeek 驱动 Claude Code 编程
date: 2026-05-06
tags: [AI, 工具, 教程]
---

## 什么是 Claude Code？

Claude Code 是 Anthropic 推出的命令行 AI 编程助手，直接在终端中运行，可以：

- 📖 阅读和理解你的代码库
- ✍️ 编写和修改代码
- 🐛 调试和修复 Bug
- 💡 回答技术问题

## 为什么用 DeepSeek？

官方 Claude API 在国内访问需要代理，而且价格不低。DeepSeek 提供了 **Anthropic 协议兼容接口**，可以直接对接 Claude Code：

| 对比项 | Anthropic 官方 | DeepSeek |
|--------|---------------|----------|
| 国内访问 | 需要代理 | 直连 |
| 付款方式 | 外币信用卡 | 支付宝 |
| 价格 | 较高 | 便宜很多 |
| 模型质量 | Claude 系列 | DeepSeek V4 |

## 配置步骤

### 1. 获取 API Key

访问 [platform.deepseek.com](https://platform.deepseek.com) 注册并创建 API Key。

### 2. 配置 settings.json

在 `~/.claude/settings.json` 中写入：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的API Key",
    "ANTHROPIC_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash"
  }
}
```

### 3. 启动使用

```bash
cd your-project
claude
```

就这样，一个 AI 编程助手就在你终端里了。

## 使用技巧

- **`/model`** - 查看和切换当前模型
- **`/memory`** - 编辑项目记忆（CLAUDE.md）
- **`/init`** - 自动生成项目 CLAUDE.md
- 用自然语言描述你想做什么，它会帮你实现

## 总结

DeepSeek + Claude Code 的组合，让国内开发者也能低成本享受 AI 辅助编程的乐趣。推荐试试！
