# 🌍 语言切换功能说明

## 功能概述

为 Chrome 扩展添加了用户可控的语言切换功能，支持中英文界面切换。

## 界面效果

在设置页面中，用户可以看到：

```
┌─────────────────────────────────────┐
│  界面语言 / Interface Language      │
├─────────────────────────────────────┤
│                                     │
│  Language: [下拉选择框]             │
│            ├─ 自动检测               │
│            ├─ 简体中文               │
│            └─ English                │
│                                     │
│  💡 选择"自动检测"将根据浏览器       │
│     语言自动切换                     │
│                                     │
└─────────────────────────────────────┘
```

## 三种模式

### 1. 🔄 自动检测（默认）
- 根据浏览器语言自动选择界面语言
- 中文浏览器 → 显示中文界面
- 其他语言浏览器 → 显示英文界面

### 2. 🇨🇳 简体中文
- 无论浏览器语言设置如何
- 始终显示中文界面
- 适合中文用户固定使用

### 3. 🇬🇧 English
- 无论浏览器语言设置如何
- 始终显示英文界面
- 适合英文用户或多语言环境

## 使用场景

### 场景 1: 国际用户
```
用户在中文系统但希望学习英文
→ 选择 "English"
→ 所有界面显示英文
```

### 场景 2: 海外华人
```
用户在英文系统但更习惯中文
→ 选择 "简体中文"
→ 所有界面显示中文
```

### 场景 3: 共享设备
```
多人使用同一设备，语言偏好不同
→ 选择 "自动检测"
→ 根据浏览器语言自动切换
```

## 切换流程

```
打开设置页面
    ↓
选择语言选项
    ↓
点击"保存设置"
    ↓
页面自动刷新
    ↓
界面以新语言显示
```

## 数据存储

```javascript
// Chrome Storage
{
  language: 'auto'   // 自动检测
  language: 'zh-CN'  // 简体中文
  language: 'en'     // English
  language: null     // 也表示自动检测
}
```

## API 接口

### I18n 类新增方法

```javascript
// 手动设置语言
await window.i18n.setLocale('zh-CN')
await window.i18n.setLocale('en')

// 获取当前语言
const currentLang = window.i18n.getLocale()
// 返回: 'zh-CN' 或 'en'

// 检测语言（含存储检查）
const detected = await window.i18n.detectLocale()
// 优先返回用户设置，否则返回浏览器语言
```

## 翻译键

### 中文 (zh-CN.json)
```json
{
  "options": {
    "language": "界面语言",
    "languageLabel": "Language:",
    "languageAuto": "自动检测",
    "languageZhCN": "简体中文",
    "languageEn": "English",
    "languageHint": "选择\"自动检测\"将根据浏览器语言自动切换"
  }
}
```

### 英文 (en.json)
```json
{
  "options": {
    "language": "Interface Language",
    "languageLabel": "Language:",
    "languageAuto": "Auto Detect",
    "languageZhCN": "简体中文",
    "languageEn": "English",
    "languageHint": "Select \"Auto Detect\" to automatically switch based on browser language"
  }
}
```

## 兼容性

- ✅ 兼容原有自动检测功能
- ✅ 无缝升级，不影响现有用户
- ✅ 首次使用自动检测（默认行为）
- ✅ 设置后立即生效
- ✅ 跨页面同步（popup、options、donate）

## 测试步骤

1. **测试自动检测**
   - 清空 storage 或选择"自动检测"
   - 更改浏览器语言设置
   - 重新加载扩展
   - 验证界面语言正确

2. **测试中文模式**
   - 选择"简体中文"
   - 保存设置
   - 所有页面应显示中文

3. **测试英文模式**
   - 选择"English"
   - 保存设置
   - 所有页面应显示英文

4. **测试切换**
   - 在中文和英文间切换
   - 验证页面自动刷新
   - 验证新语言立即应用

## 注意事项

⚠️ 切换语言会自动刷新页面
⚠️ 未保存的设置可能丢失
⚠️ 建议在更改其他设置前先切换语言
✅ 语言设置会立即同步到所有扩展页面
