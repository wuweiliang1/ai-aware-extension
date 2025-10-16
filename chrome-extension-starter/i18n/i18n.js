// i18n utility for Chrome Extension

class I18n {
  constructor() {
    this.locale = 'en';
    this.messages = {};
    this.fallbackLocale = 'en';
  }

  // Detect user's locale
  async detectLocale() {
    // First check if user has manually set a language
    const storage = await new Promise(resolve => {
      chrome.storage.local.get(['language'], resolve);
    });
    
    if (storage.language) {
      console.log('[i18n] Using saved language:', storage.language);
      return storage.language;
    }
    
    // Try browser language first
    const browserLang = navigator.language || navigator.userLanguage;
    console.log('[i18n] Browser language:', browserLang);
    
    // Map variations to supported locales
    if (browserLang.startsWith('zh')) {
      // Chinese variants: zh-CN, zh-Hans, zh-SG, zh
      return 'zh-CN';
    } else {
      // Default to English
      return 'en';
    }
  }

  // Load locale messages
  async loadMessages(locale) {
    try {
      const url = chrome.runtime.getURL(`i18n/${locale}.json`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load locale: ${locale}`);
      }
      const messages = await response.json();
      return messages;
    } catch (e) {
      console.error('[i18n] Error loading messages:', e);
      return null;
    }
  }

  // Initialize i18n
  async init() {
    this.locale = await this.detectLocale();
    console.log('[i18n] Detected locale:', this.locale);
    
    // Load messages for detected locale
    this.messages = await this.loadMessages(this.locale);
    
    // Load fallback if needed
    if (!this.messages && this.locale !== this.fallbackLocale) {
      console.log('[i18n] Loading fallback locale:', this.fallbackLocale);
      this.messages = await this.loadMessages(this.fallbackLocale);
      this.locale = this.fallbackLocale;
    }
    
    if (!this.messages) {
      console.error('[i18n] Failed to load any messages');
      this.messages = {};
    }
    
    return this;
  }

  // Set language manually
  async setLocale(locale) {
    // Save to storage
    await new Promise(resolve => {
      chrome.storage.local.set({ language: locale }, resolve);
    });
    
    // Reload messages
    this.locale = locale;
    this.messages = await this.loadMessages(locale);
    
    if (!this.messages && locale !== this.fallbackLocale) {
      this.messages = await this.loadMessages(this.fallbackLocale);
      this.locale = this.fallbackLocale;
    }
    
    console.log('[i18n] Language changed to:', this.locale);
    return this;
  }

  // Get translated message
  t(key, defaultValue = '') {
    const keys = key.split('.');
    let value = this.messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn('[i18n] Missing translation for:', key);
        return defaultValue || key;
      }
    }
    
    return value || defaultValue || key;
  }

  // Get current locale
  getLocale() {
    return this.locale;
  }

  // Check if current locale is Chinese
  isChinese() {
    return this.locale.startsWith('zh');
  }
}

// Create global instance
window.i18n = new I18n();
