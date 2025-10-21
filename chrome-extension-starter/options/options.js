// Options page with i18n support

function storageGet(keys) { return new Promise(res => chrome.storage.local.get(keys, res)); }
function storageSet(obj) { return new Promise(res => chrome.storage.local.set(obj, res)); }

// Get the correct apiKey key based on provider
function getApiKeyKey(provider) {
  switch(provider) {
    case 'deepseek': return 'deepseekApiKey';
    case 'openai': return 'openaiApiKey';
    case 'openai-compatible': return 'compatibleApiKey';
    default: return 'apiKey'; // for local or others
  }
}

// Apply translations to page
function applyTranslations() {
  // Translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = window.i18n.t(key);
    
    // For HTML content that needs to preserve structure, use textContent for simple text
    if (key === 'options.hint') {
      // Keep the HTML structure for multi-line hint
      el.innerHTML = translation;
    } else {
      el.textContent = translation;
    }
  });
  
  // Translate placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = window.i18n.t(key);
  });
}

// Wait for i18n to be ready
(async function() {
  await window.i18n.init();
  applyTranslations();
  
  const providerEl = document.getElementById('provider');
  const apiKeyEl = document.getElementById('apiKey');
  const customEndpointEl = document.getElementById('customEndpoint');
  const customEndpointLabel = document.getElementById('customEndpointLabel');
  const authMethodEl = document.getElementById('authMethod');
  const authMethodLabel = document.getElementById('authMethodLabel');
  const customModelEl = document.getElementById('customModel');
  const customModelLabel = document.getElementById('customModelLabel');
  const reopenTabEl = document.getElementById('reopenTab');
  const languageEl = document.getElementById('language');
  const saveBtn = document.getElementById('save');
  const testBtn = document.getElementById('test');
  const status = document.getElementById('status');
  const testStatus = document.getElementById('testStatus');

  // Show/hide custom endpoint fields based on provider selection
  function updateFieldsVisibility() {
    const provider = providerEl.value;
    
    // Hide all help sections first
    document.getElementById('deepseekHelp').style.display = 'none';
    document.getElementById('openaiHelp').style.display = 'none';
    document.getElementById('compatibleHelp').style.display = 'none';
    
    // Show appropriate help section
    if (provider === 'deepseek') {
      document.getElementById('deepseekHelp').style.display = 'block';
    } else if (provider === 'openai') {
      document.getElementById('openaiHelp').style.display = 'block';
    } else if (provider === 'openai-compatible') {
      document.getElementById('compatibleHelp').style.display = 'block';
    }
    
    // Show/hide API Key field and help for local mode
    const apiKeyLabel = document.getElementById('apiKeyLabel');
    const apiKeyHelp = document.getElementById('apiKeyHelp');
    if (provider === 'local') {
      apiKeyLabel.style.display = 'none';
      apiKeyHelp.style.display = 'none';
    } else {
      apiKeyLabel.style.display = 'block';
      apiKeyHelp.style.display = 'block';
    }
    
    // Show/hide custom endpoint fields
    if (provider === 'openai-compatible') {
      customEndpointLabel.style.display = 'block';
      authMethodLabel.style.display = 'block';
      customModelLabel.style.display = 'block';
    } else {
      customEndpointLabel.style.display = 'none';
      authMethodLabel.style.display = 'none';
      customModelLabel.style.display = 'none';
    }
  }

  providerEl.addEventListener('change', async () => {
    const newProvider = providerEl.value;
    const apiKeyKey = getApiKeyKey(newProvider);
    const data = await storageGet([apiKeyKey]);
    apiKeyEl.value = (data && data[apiKeyKey]) || '';
    updateFieldsVisibility();
  });

  async function loadOptions() {
    const data = await storageGet(['provider','apiKey','deepseekApiKey','openaiApiKey','compatibleApiKey','customEndpoint','authMethod','customModel','reopenTab','language']);
    console.log('[Options] loaded:', data);
    const provider = (data && data.provider) || 'local';
    providerEl.value = provider;
    const apiKeyKey = getApiKeyKey(provider);
    apiKeyEl.value = (data && data[apiKeyKey]) || '';
    customEndpointEl.value = (data && data.customEndpoint) || '';
    authMethodEl.value = (data && data.authMethod) || 'bearer';
    customModelEl.value = (data && data.customModel) || '';
    reopenTabEl.checked = (data && data.reopenTab) !== false; // Default to true
    languageEl.value = (data && data.language) || 'auto';
    updateFieldsVisibility();
  }

  saveBtn.addEventListener('click', async () => {
    const provider = providerEl.value;
    const apiKey = apiKeyEl.value;
    const customEndpoint = customEndpointEl.value;
    const authMethod = authMethodEl.value;
    const customModel = customModelEl.value;
    const reopenTab = reopenTabEl.checked;
    const selectedLanguage = languageEl.value; // 'auto' | 'en' | 'zh-CN' ...

    // Read previous stored language BEFORE saving to detect changes correctly
    const prevStored = await storageGet(['language']);
    const prevSelected = (prevStored && prevStored.language) ? prevStored.language : 'auto';

    // Build settings to save; store null for 'auto' so i18n falls back to detection
    const apiKeyKey = getApiKeyKey(provider);
    const settings = {
      provider,
      [apiKeyKey]: apiKey,
      customEndpoint,
      authMethod,
      customModel,
      reopenTab,
      language: selectedLanguage === 'auto' ? null : selectedLanguage
    };

    // Save all settings
    await storageSet(settings);
    console.log('[Options] saved:', { provider, [apiKeyKey]: apiKey ? '***' : '', customEndpoint, authMethod, customModel, reopenTab, language: settings.language || 'auto' });

    // If language selection changed, reload the page with the new language
    if (selectedLanguage !== prevSelected) {
      if (selectedLanguage !== 'auto') {
        await window.i18n.setLocale(selectedLanguage);
      }
      // Reload the page to apply translations
      window.location.reload();
      return;
    }
    
    status.textContent = '✓ ' + window.i18n.t('options.saved');
    status.style.background = 'rgba(16, 185, 129, 0.1)';
    status.style.color = '#10b981';
    status.style.border = '1px solid rgba(16, 185, 129, 0.2)';
    status.classList.add('show');
    setTimeout(() => {
      status.textContent = '';
      status.classList.remove('show');
    }, 2000);
  });

  testBtn.addEventListener('click', async () => {
    const provider = providerEl.value;
    const apiKey = apiKeyEl.value;
    const customEndpoint = customEndpointEl.value;
    const authMethod = authMethodEl.value;
    const customModel = customModelEl.value;
    
    if (provider === 'local') {
      testStatus.textContent = '✓ ' + window.i18n.t('options.testLocalMode');
      testStatus.style.background = 'rgba(16, 185, 129, 0.1)';
      testStatus.style.color = '#10b981';
      testStatus.style.border = '1px solid rgba(16, 185, 129, 0.2)';
      testStatus.classList.add('show');
      return;
    }
    
    if (!apiKey) {
      testStatus.textContent = '⚠ ' + window.i18n.t('options.testNoApiKey');
      testStatus.style.background = 'rgba(239, 68, 68, 0.1)';
      testStatus.style.color = '#ef4444';
      testStatus.style.border = '1px solid rgba(239, 68, 68, 0.2)';
      testStatus.classList.add('show');
      return;
    }
    
    if (provider === 'openai-compatible' && !customEndpoint) {
      testStatus.textContent = '⚠ ' + window.i18n.t('options.testNoEndpoint');
      testStatus.style.background = 'rgba(239, 68, 68, 0.1)';
      testStatus.style.color = '#ef4444';
      testStatus.style.border = '1px solid rgba(239, 68, 68, 0.2)';
      testStatus.classList.add('show');
      return;
    }
    
    testStatus.textContent = '⏳ ' + window.i18n.t('options.testTesting');
    testStatus.style.background = 'rgba(100, 116, 139, 0.1)';
    testStatus.style.color = '#64748b';
    testStatus.style.border = '1px solid rgba(100, 116, 139, 0.2)';
    testStatus.classList.add('show');
    
    try {
      const resp = await chrome.runtime.sendMessage({ 
        type: 'test-api', 
        provider, 
        apiKey,
        customEndpoint,
        authMethod,
        customModel
      });
      
      if (resp.success) {
        testStatus.textContent = '✓ ' + resp.message;
        testStatus.style.background = 'rgba(16, 185, 129, 0.1)';
        testStatus.style.color = '#10b981';
        testStatus.style.border = '1px solid rgba(16, 185, 129, 0.2)';
      } else {
        testStatus.textContent = '✗ ' + resp.message;
        testStatus.style.background = 'rgba(239, 68, 68, 0.1)';
        testStatus.style.color = '#ef4444';
        testStatus.style.border = '1px solid rgba(239, 68, 68, 0.2)';
      }
    } catch (err) {
      testStatus.textContent = '✗ ' + window.i18n.t('options.testError') + ': ' + err.message;
      testStatus.style.background = 'rgba(239, 68, 68, 0.1)';
      testStatus.style.color = '#ef4444';
      testStatus.style.border = '1px solid rgba(239, 68, 68, 0.2)';
    }
  });

  // Donate button
  document.getElementById('donateBtn').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('donate/donate.html') });
  });

  // Load options on init
  loadOptions();
})();
