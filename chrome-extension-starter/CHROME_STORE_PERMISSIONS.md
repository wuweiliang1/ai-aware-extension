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
- Check if a bookmark's URL is already open in an existing tab
- Activate (focus) existing tabs instead of opening duplicates
- Open new tabs when the bookmark is not already open
- Manage tab state according to user preferences (reopen vs. activate)

This permission enables smart tab management, preventing duplicate tabs and providing a seamless user experience. The extension only interacts with tabs that match found bookmarks.

**中文：**
需要 "tabs" 权限用于：
- 检查书签的 URL 是否已在现有标签页中打开
- 激活（聚焦）现有标签页，而不是打开重复标签页
- 当书签尚未打开时打开新标签页
- 根据用户偏好管理标签页状态（重新打开 vs. 激活）

此权限实现智能标签页管理，防止重复标签页并提供无缝的用户体验。扩展仅与匹配找到的书签的标签页交互。

---

## 5. Host Permissions Justification (主机权限理由)

**English:**
Host permissions are required for:

**API Endpoints (https://api.deepseek.com/*, https://api.openai.com/*):**
- Send natural language queries to AI services for intent matching
- Receive AI-generated bookmark recommendations
- Enable the core AI-powered search functionality

**Broad host permissions (http://*/*, https://*/*):**
- Required by Chrome's tabs API to check if bookmark URLs are already open
- Enable tab activation and management across all domains
- No actual data is accessed from these hosts - permission is only for tab URL comparison

The extension does not inject content scripts or access page content. These permissions are solely for API communication and tab URL matching functionality.

**中文：**
需要主机权限用于：

**API 端点 (https://api.deepseek.com/*, https://api.openai.com/*)：**
- 将自然语言查询发送到 AI 服务进行意图匹配
- 接收 AI 生成的书签推荐
- 启用核心 AI 驱动的搜索功能

**广泛的主机权限 (http://*/*, https://*/*)：**
- Chrome 的 tabs API 需要此权限来检查书签 URL 是否已打开
- 实现跨所有域的标签页激活和管理
- 不会从这些主机访问任何实际数据 - 权限仅用于标签页 URL 比较

扩展不会注入内容脚本或访问页面内容。这些权限仅用于 API 通信和标签页 URL 匹配功能。

---

## Summary (总结)

All requested permissions are essential for the extension's core functionality of AI-powered bookmark finding and opening. We follow the principle of least privilege and only request permissions that are absolutely necessary. User privacy is our top priority - no data is collected, tracked, or shared with third parties.

所有请求的权限都是扩展的 AI 驱动书签查找和打开核心功能所必需的。我们遵循最小权限原则，仅请求绝对必要的权限。用户隐私是我们的首要任务 - 不会收集、跟踪或与第三方共享任何数据。
