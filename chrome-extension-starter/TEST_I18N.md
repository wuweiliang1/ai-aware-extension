# 国际化 (i18n) 测试指南

## 已完成的工作

✅ 创建了完整的国际化基础设施
✅ 实现了自动语言检测（根据浏览器语言）
✅ 更新了所有页面的HTML和JS文件
✅ 创建了完整的中英文语言包

## 语言文件

- `i18n/zh-CN.json` - 简体中文翻译
- `i18n/en.json` - 英文翻译  
- `i18n/i18n.js` - 国际化工具类

## 支持的语言

- **简体中文 (zh-CN)**: 当浏览器语言设置为中文时自动使用
- **英文 (en)**: 默认语言，当浏览器语言不是中文时使用

## 已国际化的页面

1. **Popup页面** (`popup/`)
   - ✅ popup.html - 所有文本添加了 data-i18n 属性
   - ✅ popup.js - 所有动态文本使用 window.i18n.t() 函数

2. **Options页面** (`options/`)
   - ✅ options.html - 所有文本添加了 data-i18n 属性
   - ✅ options.js - 所有动态文本使用 window.i18n.t() 函数

3. **Donate页面** (`donate/`)
   - ✅ donate.html - 所有文本添加了 data-i18n 属性
   - ✅ donate.js - 集成了语言检测用于区域判断

## 测试方法

### 1. 测试中文环境

1. 在Chrome中打开 `chrome://settings/languages`
2. 将"中文（简体）"设置为首选语言
3. 重新加载扩展
4. 打开Popup - 应该显示中文界面
5. 打开Options - 应该显示中文界面  
6. 打开Donate - 应该显示中文界面并优先显示微信支付

### 2. 测试英文环境

1. 在Chrome中打开 `chrome://settings/languages`
2. 将"English"设置为首选语言
3. 重新加载扩展
4. 打开Popup - 应该显示英文界面
5. 打开Options - 应该显示英文界面
6. 打开Donate - 应该显示英文界面并优先显示PayPal

### 3. 功能测试

测试所有翻译的文本：
- [ ] 静态页面文本（标题、按钮、标签）
- [ ] 动态消息（搜索状态、错误提示）
- [ ] 输入框占位符
- [ ] 工具提示文本
- [ ] API测试结果消息
- [ ] 历史记录相关文本

## 翻译键结构

```javascript
{
  "popup": { /* 20+ 个键 */ },
  "options": { /* 30+ 个键 */ },
  "donate": { /* 15+ 个键 */ },
  "common": { /* 3 个通用键 */ }
}
```

## 添加新翻译

如需添加新的翻译文本：

1. 在 `i18n/zh-CN.json` 和 `i18n/en.json` 中添加新键
2. 在HTML中使用 `data-i18n="key.path"` 属性
3. 在JS中使用 `window.i18n.t('key.path')` 函数

## 技术实现

- **语言检测**: `navigator.language` API
- **翻译函数**: 支持点号路径 `i18n.t('popup.title')`
- **自动应用**: HTML元素上的 data-i18n 属性自动翻译
- **异步加载**: 在页面渲染前等待语言文件加载完成

## 注意事项

- 所有语言文件使用UTF-8编码
- JSON文件中的中文引号需要转义
- HTML内容（如带<br>的文本）使用innerHTML而非textContent
- 扩展重新加载后会重新检测浏览器语言

## 🆕 语言切换功能

### 新增功能

在设置页面添加了手动语言切换选项，用户可以：

1. **自动检测** (默认) - 根据浏览器语言自动选择
2. **简体中文** - 强制使用中文界面
3. **English** - 强制使用英文界面

### 使用方法

1. 打开扩展的设置页面
2. 找到"界面语言 / Interface Language"选项
3. 选择你想要的语言：
   - **自动检测**: 跟随浏览器语言设置
   - **简体中文**: 始终显示中文
   - **English**: 始终显示英文
4. 点击"保存设置"按钮
5. 页面会自动刷新并应用新语言

### 技术实现

- 语言设置存储在 `chrome.storage.local` 的 `language` 字段
- 选择"自动检测"时，`language` 字段为 `null`，系统使用浏览器语言
- 选择特定语言时，保存对应的语言代码（`zh-CN` 或 `en`）
- 切换语言后会自动刷新页面以应用新的翻译

### 存储键

```javascript
{
  language: 'auto' | 'zh-CN' | 'en' | null
}
```

- `'auto'` 或 `null` - 自动检测
- `'zh-CN'` - 简体中文
- `'en'` - 英文

### 更新的文件

- ✅ `i18n/i18n.js` - 添加了 `setLocale()` 方法和存储检查
- ✅ `i18n/zh-CN.json` - 添加了语言选项相关翻译
- ✅ `i18n/en.json` - 添加了语言选项相关翻译
- ✅ `options/options.html` - 添加了语言选择器UI
- ✅ `options/options.js` - 添加了语言切换逻辑

### 优先级

语言选择的优先级顺序：

1. 用户手动设置的语言（存储在 `chrome.storage.local.language`）
2. 浏览器语言设置（`navigator.language`）
3. 默认英文 fallback
