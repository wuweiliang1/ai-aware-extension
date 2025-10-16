# Chrome Web Store - Permission Justifications

## 1. Single Purpose Description (单一用途说明)

**English:**
AI Bookmark Finder serves a single purpose: to help users quickly find and open their bookmarks using natural language intent matching powered by AI. The extension analyzes user's search queries, matches them with saved bookmarks, and opens the relevant bookmarks in browser tabs.

**中文：**
AI 书签查找器具有单一用途：帮助用户使用 AI 驱动的自然语言意图匹配，快速查找并打开他们的书签。该扩展分析用户的搜索查询，将其与保存的书签进行匹配，并在浏览器标签页中打开相关书签。

---

## 2. Storage Permission Justification (storage 权限理由)

**English:**
The "storage" permission is required to:
- Save user's AI API configuration (provider selection, API keys, custom endpoints)
- Store user preferences (language settings, tab behavior options)
- Cache search history for quick access to recent queries
- Persist settings across browser sessions

All data is stored locally in the user's browser and is never transmitted to our servers. This permission is essential for maintaining user settings and providing a personalized experience.

**中文：**
需要 "storage" 权限用于：
- 保存用户的 AI API 配置（提供商选择、API 密钥、自定义端点）
- 存储用户偏好设置（语言设置、标签页行为选项）
- 缓存搜索历史记录，便于快速访问最近的查询
- 在浏览器会话之间保持设置

所有数据均存储在用户浏览器本地，绝不会传输到我们的服务器。此权限对于维护用户设置和提供个性化体验至关重要。

---

## 3. Bookmarks Permission Justification (bookmarks 权限理由)

**English:**
The "bookmarks" permission is the core functionality requirement:
- Read user's bookmark tree to build a searchable index
- Match user's natural language queries against bookmark titles and URLs
- Provide AI-powered intent matching to find relevant bookmarks

Without this permission, the extension cannot access bookmarks and therefore cannot fulfill its primary purpose. No bookmarks are modified, deleted, or uploaded - the extension only reads bookmark data for matching purposes.

**中文：**
"bookmarks" 权限是核心功能要求：
- 读取用户的书签树以构建可搜索索引
- 将用户的自然语言查询与书签标题和 URL 进行匹配
- 提供 AI 驱动的意图匹配来查找相关书签

没有此权限，扩展无法访问书签，因此无法实现其主要目的。不会修改、删除或上传任何书签 - 扩展仅读取书签数据用于匹配目的。

---

## 4. Tabs Permission Justification (tabs 权限理由)

**English:**
The "tabs" permission is required to:
- Query existing tabs to check if a bookmark's URL is already open
- Activate (focus) existing tabs instead of opening duplicates
- Create new tabs when the bookmark is not already open
- Manage tab state according to user preferences (reopen vs. activate)

Combined with "activeTab" permission, this enables smart tab management while maintaining user privacy. The extension only interacts with tabs that match found bookmarks.

**中文：**
需要 "tabs" 权限用于：
- 查询现有标签页以检查书签的 URL 是否已打开
- 激活（聚焦）现有标签页，而不是打开重复标签页
- 当书签尚未打开时创建新标签页
- 根据用户偏好管理标签页状态（重新打开 vs. 激活）

与 "activeTab" 权限结合使用，可以实现智能标签页管理，同时保护用户隐私。扩展仅与匹配找到的书签的标签页交互。

---

## 5. Host Permissions Justification (主机权限理由 - 合并说明)

**English:**
Host permissions are required for AI-powered search functionality:

**Required Host Permissions (https://api.deepseek.com/*, https://api.openai.com/*):**
- Send natural language queries to AI services for intent matching
- Receive AI-generated bookmark recommendations
- Enable core AI-powered search functionality for users who choose DeepSeek or OpenAI

**Optional Host Permissions (http://*/*, https://*/*):**
These broad permissions are marked as OPTIONAL and are ONLY requested when users configure custom API endpoints:

**Why optional?**
- NOT required for default functionality (90-95% of users)
- Only requested when users configure custom API endpoints (e.g., company internal AI services)
- Users must explicitly grant permission when configuring custom endpoints
- More secure and privacy-friendly approach

**Use cases for optional permissions:**
- Enterprise users with internal AI API endpoints
- Organizations with custom OpenAI-compatible API gateways
- Users who host their own AI services (~5-10% of users)

**Important guarantees for ALL host permissions:**
- ❌ NOT used to access or read website content
- ❌ NO content scripts injected into web pages
- ❌ NO tracking or monitoring of browsing activity
- ✅ ONLY used for API communication with AI services
- ✅ Users can use the extension without optional permissions (using DeepSeek/OpenAI or local matching mode)

**中文：**
AI 驱动搜索功能需要以下主机权限：

**必需的主机权限 (https://api.deepseek.com/*, https://api.openai.com/*)：**
- 将自然语言查询发送到 AI 服务进行意图匹配
- 接收 AI 生成的书签推荐
- 为选择 DeepSeek 或 OpenAI 的用户启用核心 AI 搜索功能

**可选主机权限 (http://*/*, https://*/*)：**
这些广泛权限标记为可选，仅在用户配置自定义 API 端点时请求：

**为什么是可选？**
- 默认功能不需要（90-95% 的用户）
- 仅在用户配置自定义 API 端点时请求（例如，公司内部 AI 服务）
- 配置自定义端点时用户必须明确授予权限
- 更安全、更保护隐私的方式

**可选权限的使用场景：**
- 拥有内部 AI API 端点的企业用户
- 拥有自定义 OpenAI 兼容 API 网关的组织
- 托管自己 AI 服务的用户（约 5-10% 的用户）

**所有主机权限的重要保证：**
- ❌ 不用于访问或读取网站内容
- ❌ 不向网页注入内容脚本
- ❌ 不跟踪或监控浏览活动
- ✅ 仅用于与 AI 服务的 API 通信
- ✅ 用户可以在不授予可选权限的情况下使用扩展（使用 DeepSeek/OpenAI 或本地匹配模式）

---

## 6. ActiveTab Permission Justification (activeTab 权限理由)

**English:**
The "activeTab" permission is required to:
- Access tab information only when the user explicitly invokes the extension
- Enable safe interaction with the current tab without requiring all host permissions upfront
- Provide a privacy-friendly way to manage tabs

This permission only grants temporary access to the active tab when the user clicks the extension icon, making it more secure than permanent broad host permissions.

**中文：**
需要 "activeTab" 权限用于：
- 仅在用户明确调用扩展时访问标签页信息
- 在不预先要求所有主机权限的情况下安全地与当前标签页交互
- 提供一种隐私友好的标签页管理方式

此权限仅在用户点击扩展图标时临时授予对活动标签页的访问权限，比永久的广泛主机权限更加安全。

---

## Summary (总结)

**Permission Model:**
- **Required permissions:** Only essential permissions needed for core functionality (storage, bookmarks, tabs, activeTab, DeepSeek/OpenAI APIs)
- **Optional permissions:** Advanced features (custom API endpoints) require additional permissions that are opt-in
- **User choice:** Users can use the extension with default providers without granting optional permissions

**Privacy commitment:**
All requested permissions are essential for the extension's AI-powered bookmark finding functionality. We follow the principle of least privilege and use optional permissions for advanced features. User privacy is our top priority - no data is collected, tracked, or shared with third parties.

**权限模型：**
- **必需权限：** 仅核心功能所需的基本权限（storage、bookmarks、tabs、activeTab、DeepSeek/OpenAI API）
- **可选权限：** 需要额外权限的高级功能（自定义 API 端点）采用可选方式
- **用户选择：** 用户可以在不授予可选权限的情况下使用默认提供商

**隐私承诺：**
所有请求的权限都是扩展的 AI 驱动书签查找功能所必需的。我们遵循最小权限原则，并对高级功能使用可选权限。用户隐私是我们的首要任务 - 不会收集、跟踪或与第三方共享任何数据。
