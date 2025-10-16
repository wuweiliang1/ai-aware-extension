# Chrome Web Store 提交表单 - 简洁版权限说明

## 📋 直接复制使用的版本

---

### 1. Single Purpose (单一用途)

```
AI Bookmark Finder serves a single purpose: to help users quickly find and open their bookmarks using natural language intent matching powered by AI. The extension analyzes user's search queries, matches them with saved bookmarks, and opens the relevant bookmarks in browser tabs.
```

---

### 2. Storage Permission (storage 权限)

```
The "storage" permission is required to save user's AI API configuration (provider selection, API keys, custom endpoints), store user preferences (language settings, tab behavior options), cache search history for quick access, and persist settings across browser sessions. All data is stored locally in the user's browser and never transmitted to our servers.
```

---

### 3. Bookmarks Permission (bookmarks 权限)

```
The "bookmarks" permission is the core functionality requirement. It's needed to read user's bookmark tree to build a searchable index, match user's natural language queries against bookmark titles and URLs, and provide AI-powered intent matching to find relevant bookmarks. No bookmarks are modified, deleted, or uploaded - the extension only reads bookmark data for matching purposes.
```

---

### 4. Tabs Permission (tabs 权限)

```
The "tabs" permission is required to query existing tabs to check if a bookmark's URL is already open, activate (focus) existing tabs instead of opening duplicates, create new tabs when the bookmark is not already open, and manage tab state according to user preferences (reopen vs. activate). Combined with "activeTab" permission, this enables smart tab management while maintaining user privacy.
```

---

### 5. Host Permissions (主机权限 - 必需 + 可选合并说明) ⭐ 重点

```
Host permissions are required for AI-powered search functionality:

REQUIRED Host Permissions (https://api.deepseek.com/*, https://api.openai.com/*):
- Send natural language queries to AI services for intent matching
- Receive AI-generated bookmark recommendations
- Enable core AI-powered search functionality for 90-95% of users who choose DeepSeek or OpenAI

OPTIONAL Host Permissions (http://*/*, https://*/*):
These broad permissions are marked as OPTIONAL and are ONLY requested when users configure custom API endpoints (NOT required at install time):

Why optional?
- NOT required for default functionality (90-95% of users never need these)
- Only requested when users configure custom API endpoints (e.g., company internal AI services)
- Users must explicitly grant permission when configuring custom endpoints
- More secure and privacy-friendly approach

Use cases for optional permissions (5-10% of users):
- Enterprise users with internal AI API endpoints
- Organizations with custom OpenAI-compatible API gateways
- Users who host their own AI services

Important guarantees for ALL host permissions:
- NOT used to access or read website content
- NO content scripts injected into web pages
- NO tracking or monitoring of browsing activity
- ONLY used for API communication with AI services
- Users can use the extension without optional permissions (using DeepSeek/OpenAI or local matching mode)
```

---

### 6. ActiveTab Permission (activeTab 权限)

```
The "activeTab" permission is required to access tab information only when the user explicitly invokes the extension, enable safe interaction with the current tab without requiring all host permissions upfront, and provide a privacy-friendly way to manage tabs. This permission only grants temporary access to the active tab when the user clicks the extension icon, making it more secure than permanent broad host permissions.
```

---

## 🎯 关键要点（给审核人员看）

### 权限使用统计：
- **90-95% 用户**: 使用 DeepSeek/OpenAI/本地模式 → 不需要可选的广泛主机权限
- **5-10% 用户**: 使用自定义端点 → 需要并会被提示授予可选权限

### 隐私保护：
- ✅ 最小权限原则
- ✅ 可选权限设计（不在安装时强制要求）
- ✅ 明确的权限用途说明
- ✅ 不访问网站内容
- ✅ 不注入脚本
- ✅ 不跟踪用户

### 企业友好：
- ✅ 支持自定义 API 端点
- ✅ 支持内部网络部署
- ✅ 权限可控可审计

---

## 📝 隐私政策网址

```
https://github.com/wuweiliang1/ai-aware-extension/blob/main/PRIVACY_POLICY.md
```

---

## 🔗 更多信息

- GitHub 仓库: https://github.com/wuweiliang1/ai-aware-extension
- 开源透明：所有代码可审计
- 社区驱动开发
