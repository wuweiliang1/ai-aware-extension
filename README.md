# AI Bookmark Finder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://www.google.com/chrome/)

> An intelligent Chrome extension that helps you find and open bookmarks using natural language and AI-powered matching.

## ✨ Features

- 🎯 **Smart Matching**: Describe your intent in natural language - no need to remember exact bookmark names
- 🤖 **AI-Powered**: Supports DeepSeek and OpenAI for accurate semantic understanding
- ⚡ **Local Mode**: Works completely offline using local matching algorithms
- 🚀 **Quick Access**: Automatically activates open tabs or creates new ones
- 🎨 **Modern UI**: Clean and beautiful dark theme interface
- 🌍 **Multi-language**: Supports English and Chinese (中文)

## 🚀 Quick Start

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/wuweiliang1/ai-aware-extension.git
   cd ai-aware-extension
   ```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable "Developer mode" (toggle in the top-right corner)

4. Click "Load unpacked" and select the `chrome-extension-starter` folder

### Configuration

1. Right-click the extension icon → **Options** (or click "Extension options" in the extension details page)

2. Choose your matching mode:
   - **Local Matching**: No API required, works completely offline
   - **DeepSeek**: Requires [DeepSeek API Key](https://platform.deepseek.com) (Recommended - cost-effective)
   - **OpenAI**: Requires [OpenAI API Key](https://platform.openai.com)
   - **Custom Endpoint**: Use your own AI service endpoint

3. If using AI mode, enter your API key

4. Click "Test Connection" to verify your configuration

5. Click "Save Settings"

### Usage

1. Click the extension icon in your browser toolbar

2. Type your intent in the search box, for example:
   - "Open project documentation"
   - "Find technical blog"
   - "Show article saved yesterday"

3. Click "Find & Open"

4. The extension will automatically find the best matching bookmark and open it (or activate an already open tab)

## 📖 How It Works

### Local Matching Mode
Uses token overlap and substring matching algorithms to score and rank bookmark titles and URLs.

### AI Mode (DeepSeek/OpenAI)
Sends user intent and bookmark list (titles and URLs) to the LLM, leveraging semantic understanding to find the best match.

## 🛠️ Technology Stack

- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No framework dependencies - lightweight and fast
- **Chrome APIs**: bookmarks, tabs, storage
- **AI Integration**: DeepSeek Chat API / OpenAI Chat Completions API

## 📂 Project Structure

```
ai-aware-extension/
├── chrome-extension-starter/     # Main extension directory
│   ├── manifest.json             # Extension configuration
│   ├── background/               # Service Worker (matching & opening logic)
│   ├── popup/                    # Popup UI
│   ├── options/                  # Settings page
│   ├── icons/                    # Extension icons
│   ├── _locales/                 # Internationalization
│   └── README.md                 # Detailed documentation
├── PRIVACY_POLICY.md             # Privacy policy
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🔒 Privacy

Your privacy is important to us:

- ❌ We do NOT collect or store your personal information
- ❌ We do NOT track your browsing history
- ❌ We do NOT upload your bookmarks to our servers
- ❌ We do NOT use analytics or tracking
- ✅ All data stays on your device
- ✅ API communication is direct between your browser and the AI provider

See our [Privacy Policy](PRIVACY_POLICY.md) for complete details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](chrome-extension-starter/LICENSE) file for details.

## 🙏 Acknowledgments

- [DeepSeek](https://www.deepseek.com/) - High-performance, cost-effective AI API
- [OpenAI](https://openai.com/) - Pioneering AI technology

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/wuweiliang1/ai-aware-extension/issues)
- **Discussions**: [GitHub Discussions](https://github.com/wuweiliang1/ai-aware-extension/discussions)

---

If you find this extension useful, please give it a ⭐ Star!
