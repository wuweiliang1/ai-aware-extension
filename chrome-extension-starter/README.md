# AI Bookmark Finder

> 智能书签查找工具 - 用自然语言描述你的意图，AI 帮你快速找到并打开最匹配的书签

## ✨ 功能特性

- 🎯 **智能匹配**：通过自然语言描述意图，无需记住准确的书签名称
- 🤖 **AI 增强**：支持 DeepSeek 和 OpenAI，提供更准确的语义理解
- ⚡ **本地模式**：也可以完全离线工作，使用本地算法匹配
- 🚀 **快速打开**：自动激活已打开的标签页或新建标签
- 🎨 **现代界面**：简洁美观的深色主题 UI

## 🚀 快速开始

### 安装

1. 下载或克隆本仓库
2. 打开 Chrome，访问 `chrome://extensions`
3. 启用右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择 `chrome-extension-starter` 文件夹

### 配置

1. 右键点击扩展图标 → **选项**（或在扩展详情页点击「扩展程序选项」）
2. 选择匹配模式：
   - **本地匹配**：无需 API，完全离线工作
   - **DeepSeek**：需要 [DeepSeek API Key](https://platform.deepseek.com)（推荐，性价比高）
   - **OpenAI**：需要 [OpenAI API Key](https://platform.openai.com)
3. 如果选择 AI 模式，填写对应的 API Key
4. 点击「测试连接」验证配置是否正确
5. 点击「保存设置」

### 使用

1. 点击浏览器工具栏的扩展图标
2. 在输入框中输入你的意图，例如：
   - "打开项目文档"
   - "查看技术博客"
   - "读昨天保存的文章"
3. 点击「查找并打开」
4. 扩展会自动找到最匹配的书签并打开（或激活已打开的标签页）

## 📖 工作原理

### 本地匹配模式
使用 token 重叠和子串匹配算法，对书签标题和 URL 进行评分排序。

### AI 模式（DeepSeek/OpenAI）
将用户意图和书签列表（包含标题和 URL）发送给 LLM，利用语义理解能力找到最匹配的书签。

**示例 Prompt：**
```
根据用户意图找到最匹配的书签。

用户意图："""打开项目文档"""

书签列表（包含标题和URL）：
1. 标题: GitHub - myproject
   URL: https://github.com/user/myproject

2. 标题: 技术文档中心
   URL: https://docs.example.com/guide

要求：
1. 如果有明确匹配的书签，返回一个只包含该书签标题的 JSON 数组
2. 如果没有合适的书签，返回空数组 []
```

## 🛠️ 技术栈

- **Manifest V3**：Chrome 扩展最新标准
- **Vanilla JavaScript**：无框架依赖，轻量快速
- **Chrome APIs**：bookmarks、tabs、storage
- **AI Integration**：DeepSeek Chat API / OpenAI Chat Completions API

## 📂 项目结构

```
chrome-extension-starter/
├── manifest.json          # 扩展配置文件
├── background/
│   └── background.js      # Service Worker（书签匹配与打开逻辑）
├── popup/
│   ├── popup.html         # 弹窗 UI
│   ├── popup.css          # 弹窗样式
│   └── popup.js           # 弹窗逻辑
├── options/
│   ├── options.html       # 设置页面
│   ├── options.css        # 设置页面样式
│   └── options.js         # 设置页面逻辑（含 API 测试）
├── icons/                 # 扩展图标
├── README.md              # 项目说明
├── package.json           # 项目元信息
└── LICENSE                # MIT 许可证
```

## 🔧 开发

### 调试

- **Service Worker 日志**：chrome://extensions → 扩展卡片 → Service Worker → Inspect
- **Popup 调试**：右键 popup → 检查
- **Options 调试**：右键 Options 页面 → 检查

### 修改后重新加载

在 `chrome://extensions` 页面点击扩展卡片的「刷新」图标。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [DeepSeek](https://www.deepseek.com/) - 提供高性能、低成本的 AI API
- [OpenAI](https://openai.com/) - 开创性的 AI 技术

---

**提示**：如果觉得这个扩展有用，欢迎给个 ⭐ Star！
