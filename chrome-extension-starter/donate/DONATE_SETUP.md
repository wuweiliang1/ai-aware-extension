# 捐赠页面配置说明

## 📝 配置步骤

### 1. 设置 PayPal 链接

编辑 `donate/donate.js` 文件，找到 `CONFIG` 对象：

```javascript
const CONFIG = {
  paypalLink: 'https://paypal.me/YourPayPalUsername', // 👈 替换这里
  wechatQRCode: '../icons/wechat-qr.png',
};
```

**如何获取 PayPal.me 链接：**
1. 登录 [PayPal](https://www.paypal.com/)
2. 访问 [PayPal.Me](https://www.paypal.com/paypalme/)
3. 创建你的个性化链接（例如：`paypal.me/yourname`）
4. 复制完整链接替换到配置中

### 2. 添加微信赞赏码

1. **生成微信赞赏码：**
   - 打开微信
   - 进入"我" → "服务" → "收付款" → "二维码收款"
   - 点击"保存收款码"
   - 将图片保存到电脑

2. **添加到扩展：**
   - 将微信赞赏码图片重命名为 `wechat-qr.png`
   - 放到 `icons/` 目录下
   - 确保路径为：`chrome-extension-starter/icons/wechat-qr.png`

3. **推荐图片规格：**
   - 格式：PNG（支持透明背景）
   - 尺寸：建议 500x500 像素或更大
   - 大小：尽量小于 500KB

### 3. 自定义文字（可选）

编辑 `donate/donate.html`，可以修改：
- 页面标题
- 感谢文字
- 支付方式说明

### 4. 测试

1. 重新加载扩展
2. 打开 Popup 或 Options 页面
3. 点击"请我喝杯咖啡"链接
4. 检查：
   - PayPal 链接是否正确
   - 微信二维码是否正常显示
   - 地区检测是否准确

## 🌍 地区检测逻辑

系统会自动检测用户地区：

**中国大陆用户：**
- 优先显示：微信赞赏
- 备选显示：PayPal

**国际用户：**
- 优先显示：PayPal
- 备选显示：微信赞赏

**检测方式：**
1. 系统时区（如：Asia/Shanghai）
2. 浏览器语言（如：zh-CN）
3. IP 地理位置（备用）

## 🎨 自定义样式

编辑 `donate/donate.css` 可以修改：
- 颜色主题
- 按钮样式
- 二维码大小
- 页面布局

## ❓ 常见问题

**Q: 微信二维码不显示？**
- 检查图片路径是否正确
- 检查图片格式（必须是 PNG/JPG）
- 查看浏览器控制台是否有错误

**Q: 想要更改地区检测逻辑？**
- 编辑 `donate/donate.js` 中的 `detectRegion()` 函数

**Q: 不想要某个支付方式？**
- 编辑 `donate/donate.html`，删除对应的 section

**Q: 想添加其他支付方式？**
- 在 `donate.html` 中添加新的 payment-card
- 在 `donate.js` 中添加对应的配置

## 📸 截图位置

如果你想在扩展商店展示捐赠页面，建议截图：
- 中国地区视图（微信优先）
- 国际地区视图（PayPal 优先）
- 移动端响应式效果

## 🚀 发布注意

发布扩展前，确保：
- ✅ PayPal 链接已更新
- ✅ 微信二维码已添加
- ✅ 测试两种地区视图
- ✅ 所有链接可以正常打开
- ✅ 图片加载正常

---

**祝你收到更多的支持！☕❤️**
