// Popup script with i18n support

// Storage helpers
function storageGet(keys) { return new Promise(res => chrome.storage.local.get(keys, res)); }
function storageSet(obj) { return new Promise(res => chrome.storage.local.set(obj, res)); }

// Apply translations to page
function applyTranslations() {
  // Translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = window.i18n.t(key);
  });
  
  // Translate placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = window.i18n.t(key);
  });
  
  // Translate title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.title = window.i18n.t(key);
  });
}

// Wait for i18n to be ready
(async function() {
  await window.i18n.init();
  applyTranslations();
  
  const status = document.getElementById('status');
  const findBtn = document.getElementById('find');
  const intentInput = document.getElementById('intent');
  const resultEl = document.getElementById('result');
  const candidatesEl = document.getElementById('candidates');
  const settingsBtn = document.getElementById('openSettings');
  const toggleHistoryBtn = document.getElementById('toggleHistory');
  const historyPanel = document.getElementById('historyPanel');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistory');

  // Load and display history
  async function loadHistory() {
    const data = await storageGet(['searchHistory']);
    const history = (data && data.searchHistory) || [];
    
    if (history.length === 0) {
      historyList.innerHTML = `<div style="color:#6b7280; font-size:12px; padding:4px">${window.i18n.t('popup.historyEmpty')}</div>`;
    } else {
      historyList.innerHTML = history.map(item => 
        `<div class="history-item" data-query="${item}">${item}</div>`
      ).join('');
      
      // Add click handlers to history items
      document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
          intentInput.value = item.dataset.query;
          historyPanel.style.display = 'none';
          intentInput.focus();
        });
      });
    }
  }

  // Save search to history (max 5 items, no duplicates)
  async function saveToHistory(query) {
    const data = await storageGet(['searchHistory']);
    let history = (data && data.searchHistory) || [];
    
    // Remove duplicate if exists
    history = history.filter(item => item !== query);
    
    // Add to front
    history.unshift(query);
    
    // Keep only last 5
    history = history.slice(0, 5);
    
    await storageSet({ searchHistory: history });
  }

  // Toggle history panel
  toggleHistoryBtn.addEventListener('click', async () => {
    if (historyPanel.style.display === 'none') {
      await loadHistory();
      historyPanel.style.display = 'block';
    } else {
      historyPanel.style.display = 'none';
    }
  });

  // Clear history
  clearHistoryBtn.addEventListener('click', async () => {
    await storageSet({ searchHistory: [] });
    await loadHistory();
  });

  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Function to perform the search
  async function performSearch() {
    const intent = intentInput.value && intentInput.value.trim();
    if (!intent) return;
    
    // Save to history
    await saveToHistory(intent);
    
    // Hide history panel if open
    historyPanel.style.display = 'none';
    
    status.innerHTML = window.i18n.t('popup.statusSearching');
    resultEl.textContent = '';
    candidatesEl.innerHTML = '';

    try {
      const resp = await chrome.runtime.sendMessage({ type: 'find-bookmark', intent });
      // resp: { best, candidates, opened }
      status.innerHTML = window.i18n.t('popup.statusDone');
      if (resp.error) {
        resultEl.textContent = window.i18n.t('common.error') + ': ' + resp.error;
      } else if (!resp.best || (resp.candidates && resp.candidates.length === 0)) {
        // No matching bookmark found
        resultEl.innerHTML = '<div style="color:#ff6b6b; margin:8px 0">' + window.i18n.t('popup.noBookmarksFound') + '</div>';
        resultEl.innerHTML += '<div style="color:#9aa4b2; font-size:12px">' + window.i18n.t('popup.searchHint') + '</div>';
      } else {
        resultEl.textContent = resp.best.title + ' → ' + resp.best.url;
        (resp.candidates || []).forEach(b => {
          const li = document.createElement('li');
          li.textContent = (b.title || b.url) + ' → ' + b.url;
          candidatesEl.appendChild(li);
        });
        if (resp.opened) {
          const openInfo = document.createElement('div');
          openInfo.style.cssText = 'margin-top:8px; font-size:12px; color:#7bd389';
          const actionText = resp.opened.action === 'reopened' ? window.i18n.t('popup.tabReopened') : 
                            resp.opened.action === 'activated' ? window.i18n.t('popup.tabActivated') : 
                            window.i18n.t('popup.tabCreated');
          openInfo.textContent = '✓ ' + actionText;
          resultEl.appendChild(openInfo);
          
          // Jump to the opened/activated tab
          if (resp.opened.tabId) {
            setTimeout(() => {
              chrome.tabs.update(resp.opened.tabId, { active: true }, () => {
                // Popup will auto-close when switching tabs
                window.close();
              });
            }, 300); // Small delay to show the success message
          }
        }
      }
    } catch (err) {
      console.error(err);
      status.innerHTML = window.i18n.t('popup.statusDone');
      resultEl.textContent = window.i18n.t('common.error') + ': ' + err.message;
    }
  }

  findBtn.addEventListener('click', performSearch);

  // Add Enter key support
  intentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Donate link
  document.getElementById('donateLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('donate/donate.html') });
  });

  // Load history on init
  loadHistory();
})();
