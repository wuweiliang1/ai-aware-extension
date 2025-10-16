# Contributing to AI Bookmark Finder

Thank you for your interest in contributing to AI Bookmark Finder! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:

1. A clear and descriptive title
2. Steps to reproduce the problem
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Browser version and OS

### Suggesting Features

We love feature suggestions! Please open an issue with:

1. A clear description of the feature
2. Why this feature would be useful
3. How it should work (if you have ideas)

### Pull Requests

1. **Fork the repository** and create your branch from `main`

2. **Make your changes**
   - Follow the existing code style
   - Keep changes focused and minimal
   - Add comments for complex logic

3. **Test your changes**
   - Load the extension in Chrome
   - Test all affected functionality
   - Verify no console errors

4. **Update documentation**
   - Update README.md if needed
   - Update code comments
   - Update changelog (if applicable)

5. **Commit your changes**
   - Use clear, descriptive commit messages
   - Reference issues if applicable (e.g., "Fix #123")

6. **Submit the pull request**
   - Provide a clear description of the changes
   - Link to related issues
   - Include screenshots for UI changes

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-aware-extension.git
   cd ai-aware-extension
   ```

2. Load the extension in Chrome:
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome-extension-starter` folder

3. Make changes and test

4. Reload the extension in `chrome://extensions` after making changes

## Code Style Guidelines

- Use clear, descriptive variable and function names
- Add comments for complex logic
- Follow existing code formatting
- Keep functions focused and single-purpose
- Use ES6+ features appropriately

## Testing

- Test in Chrome (latest version)
- Test with different bookmark configurations
- Test with both AI and local matching modes
- Verify error handling
- Check console for errors/warnings

## Project Structure

```
chrome-extension-starter/
├── manifest.json          # Extension configuration
├── background/           # Service Worker
│   └── background.js     # Core matching logic
├── popup/               # Extension popup
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── options/             # Settings page
│   ├── options.html
│   ├── options.css
│   └── options.js
├── _locales/            # Internationalization
│   ├── en/
│   └── zh_CN/
└── icons/               # Extension icons
```

## Questions?

Feel free to open an issue or discussion if you have questions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
