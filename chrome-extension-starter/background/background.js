// Background service worker (MV3): Bookmark matching and opening
self.addEventListener('install', (event) => {
  console.log('[BookmarkFinder] Service worker installed');
});

// Helper to use chrome.storage with async/await
function storageGet(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

function storageSet(obj) {
  return new Promise((resolve) => chrome.storage.local.set(obj, resolve));
}

// Get the correct apiKey key based on provider
function getApiKeyKey(provider) {
  switch(provider) {
    case 'deepseek': return 'deepseekApiKey';
    case 'openai': return 'openaiApiKey';
    case 'openai-compatible': return 'compatibleApiKey';
    default: return 'apiKey'; // for local or others
  }
}

/**
 * Local bookmark matching using token overlap and substring matching
 */
async function matchBookmarksLocal(intent, bookmarks) {
  const itokens = intent.toLowerCase().split(/\W+/).filter(Boolean);
  
  function scoreBookmark(bookmark) {
    const text = `${bookmark.title} ${bookmark.url}`.toLowerCase();
    const ttokens = text.split(/\W+/).filter(Boolean);
    let score = 0;
    
    // Token overlap
    itokens.forEach(t => { 
      if (ttokens.includes(t)) score += 1; 
    });
    
    // Substring bonus for title
    if (bookmark.title.toLowerCase().includes(intent.toLowerCase())) score += 3;
    
    // Substring bonus for URL
    if (bookmark.url.toLowerCase().includes(intent.toLowerCase())) score += 1;
    
    return score;
  }
  
  const scored = bookmarks.map(b => ({ bookmark: b, score: scoreBookmark(b) }));
  scored.sort((a, b) => b.score - a.score);
  
  // Return only the best match if score > 0, otherwise empty
  return scored.length > 0 && scored[0].score > 0 ? [scored[0].bookmark] : [];
}

async function callDeepSeekForRanking(intent, bookmarks, apiKey) {
  // Call DeepSeek Chat Completions API with fast model
  // bookmarks: array of {title, url, id}
  
  // Build a list with both title and URL for richer context
  const bookmarkList = bookmarks.map((b, i) => 
    `${i + 1}. 标题: ${b.title}\n   URL: ${b.url}`
  ).join('\n\n');
  
  const prompt = `根据用户意图找到最匹配的书签。

用户意图："""${intent}"""

书签列表（包含标题和URL）：
${bookmarkList}

要求：
1. 如果有明确匹配的书签，返回一个只包含该书签标题的 JSON 数组
2. 如果没有合适的书签，返回空数组 []
3. 书签标题必须与上述列表中的"标题"字段完全一致

返回格式示例：
- 有匹配：["技术文档中心"]
- 无匹配：[]`;

  try {
    console.log('[DeepSeek] Calling API with intent:', intent, 'bookmarks:', bookmarks.length);
    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 600
      })
    });
    
    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[DeepSeek] API error', resp.status, errText);
      return []; // Return empty if API fails
    }
    
    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content || '';
    console.log('[DeepSeek] Response:', text);
    
    // Extract JSON array from response (handles markdown code blocks too)
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        console.log('[DeepSeek] Parsed ranking:', parsed);
        // Only return up to 1 result as requested
        return parsed.slice(0, 1);
      }
    }
    
    console.warn('[DeepSeek] Could not parse JSON from response');
    return [];
  } catch (e) {
    console.error('[DeepSeek] Call failed', e);
    return [];
  }
}

async function callLLMForRanking(intent, bookmarks, config) {
  // Generic LLM caller supporting DeepSeek, OpenAI, and OpenAI-compatible endpoints
  const { provider, apiKey, customEndpoint, authMethod, customModel, contextMode } = config;
  
  // Build bookmark list based on context mode
  let bookmarkList, listDescription;
  if (contextMode === 'title-only') {
    // Title only mode - faster, less tokens
    bookmarkList = bookmarks.map((b, i) => 
      `${i + 1}. ${b.title}`
    ).join('\n');
    listDescription = '书签列表（仅标题）';
  } else {
    // Title + URL mode (default) - more accurate
    bookmarkList = bookmarks.map((b, i) => 
      `${i + 1}. 标题: ${b.title}\n   URL: ${b.url}`
    ).join('\n\n');
    listDescription = '书签列表（包含标题和URL）';
  }
  
  const prompt = `根据用户意图找到最匹配的书签。

用户意图："""${intent}"""

${listDescription}：
${bookmarkList}

要求：
1. 如果有明确匹配的书签，返回一个只包含该书签标题的 JSON 数组
2. 如果没有合适的书签，返回空数组 []
3. 书签标题必须与上述列表中的"标题"字段完全一致

返回格式示例：
- 有匹配：["技术文档中心"]
- 无匹配：[]`;

  // Determine endpoint, model and headers based on provider
  let endpoint, model, headers;
  if (provider === 'deepseek') {
    endpoint = 'https://api.deepseek.com/v1/chat/completions';
    model = 'deepseek-chat';
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  } else if (provider === 'openai') {
    endpoint = 'https://api.openai.com/v1/chat/completions';
    model = 'gpt-3.5-turbo';
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  } else if (provider === 'openai-compatible') {
    endpoint = customEndpoint;
    model = customModel || 'gpt-3.5-turbo';
    
    // Set authentication header based on authMethod
    headers = { 'Content-Type': 'application/json' };
    const method = authMethod || 'bearer';
    
    if (method === 'bearer') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (method === 'openai-api-key') {
      headers['OPENAI_API_KEY'] = apiKey;
    } else if (method === 'x-api-key') {
      headers['X-API-Key'] = apiKey;
    } else if (method === 'api-key') {
      headers['api-key'] = apiKey;
    }
  } else {
    console.error('[LLM] Unknown provider:', provider);
    return [];
  }

  try {
    console.log('[LLM] Calling API:', provider, endpoint, 'model:', model, 'authMethod:', authMethod || 'bearer');
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 600
      })
    });
    
    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[LLM] API error', resp.status, errText);
      return []; // Return empty if API fails
    }
    
    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content || '';
    console.log('[LLM] Response:', text);
    
    // Extract JSON array from response (handles markdown code blocks too)
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        console.log('[LLM] Parsed ranking:', parsed);
        // Only return up to 1 result as requested
        return parsed.slice(0, 1);
      }
    }
    
    console.warn('[LLM] Could not parse JSON from response');
    return [];
  } catch (e) {
    console.error('[LLM] Call failed', e);
    return [];
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('[BookmarkFinder] Message received:', msg.type);
  
  // Test API connectivity
  if (msg && msg.type === 'test-api') {
    (async () => {
      const { provider, apiKey, customEndpoint, authMethod, customModel } = msg;
      try {
        if (provider === 'deepseek') {
          const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [{ role: 'user', content: 'test' }],
              max_tokens: 10
            })
          });
          if (resp.ok) {
            sendResponse({ success: true, message: 'DeepSeek API 连接成功' });
          } else {
            const err = await resp.text();
            sendResponse({ success: false, message: `DeepSeek API 错误: ${resp.status}`, error: err });
          }
        } else if (provider === 'openai') {
          const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: 'test' }],
              max_tokens: 10
            })
          });
          if (resp.ok) {
            sendResponse({ success: true, message: 'OpenAI API 连接成功' });
          } else {
            const err = await resp.text();
            sendResponse({ success: false, message: `OpenAI API 错误: ${resp.status}`, error: err });
          }
        } else if (provider === 'openai-compatible') {
          if (!customEndpoint) {
            sendResponse({ success: false, message: '请配置自定义 API Endpoint' });
            return;
          }
          
          const model = customModel || 'gpt-3.5-turbo';
          const method = authMethod || 'bearer';
          
          // Build headers based on auth method
          const headers = { 'Content-Type': 'application/json' };
          if (method === 'bearer') {
            headers['Authorization'] = `Bearer ${apiKey}`;
          } else if (method === 'openai-api-key') {
            headers['OPENAI_API_KEY'] = apiKey;
          } else if (method === 'x-api-key') {
            headers['X-API-Key'] = apiKey;
          } else if (method === 'api-key') {
            headers['api-key'] = apiKey;
          }
          
          const resp = await fetch(customEndpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: 'test' }],
              max_tokens: 10
            })
          });
          if (resp.ok) {
            sendResponse({ success: true, message: `自定义 API 连接成功 (${model}, ${method})` });
          } else {
            const err = await resp.text();
            sendResponse({ success: false, message: `自定义 API 错误: ${resp.status}`, error: err });
          }
        } else {
          sendResponse({ success: true, message: '本地匹配模式，无需测试' });
        }
      } catch (e) {
        sendResponse({ success: false, message: '连接失败', error: String(e) });
      }
    })();
    return true;
  }
  
  // Find bookmark from user's bookmarks, rank and open it
  if (msg && msg.type === 'find-bookmark') {
    (async () => {
      const intent = msg.intent || '';
      // get bookmarks
      const getTree = () => new Promise((res) => chrome.bookmarks.getTree(res));
      let tree = [];
      try {
        tree = await getTree();
      } catch (e) {
        console.error('[BookmarkFinder] Failed to get bookmarks', e);
        sendResponse({ error: 'failed_to_get_bookmarks' });
        return;
      }
      // flatten bookmarks to {title, url, id}
      const flat = [];
      function walk(nodes) {
        for (const n of nodes) {
          if (n.url) flat.push({ title: n.title || n.url, url: n.url, id: n.id });
          if (n.children) walk(n.children);
        }
      }
      walk(tree);

      let matchedBookmarks = [];
      try {
        const cfg = await storageGet(['provider','apiKey','deepseekApiKey','openaiApiKey','compatibleApiKey','customEndpoint','authMethod','customModel','contextMode','reopenTab']);
        const provider = cfg.provider || 'local';
        const contextMode = cfg.contextMode || 'title-url'; // Default to title-url for better accuracy
        const reopenTab = cfg.reopenTab !== false; // Default to true
        const apiKeyKey = getApiKeyKey(provider);
        console.log('[BookmarkFinder] provider:', provider, 'hasApiKey:', !!cfg[apiKeyKey], 'contextMode:', contextMode, 'reopenTab:', reopenTab);
        
        if ((provider === 'deepseek' || provider === 'openai' || provider === 'openai-compatible') && cfg[apiKeyKey]) {
          console.log('[BookmarkFinder] calling LLM for ranking');
          const orderedTitles = await callLLMForRanking(intent, flat, {
            provider,
            apiKey: cfg[apiKeyKey],
            customEndpoint: cfg.customEndpoint,
            authMethod: cfg.authMethod,
            customModel: cfg.customModel,
            contextMode: contextMode
          });
          matchedBookmarks = orderedTitles.map(t => flat.find(b => b.title === t)).filter(Boolean);
        } else {
          console.log('[BookmarkFinder] using local matching');
          matchedBookmarks = await matchBookmarksLocal(intent, flat);
        }
      } catch (e) {
        console.error('[BookmarkFinder] match error', e);
        matchedBookmarks = [];
      }

      const best = matchedBookmarks.length ? matchedBookmarks[0] : null;

      // Open or activate the best bookmark's URL
      let openResult = null;
      if (best && best.url) {
        try {
          const cfg = await storageGet(['reopenTab']);
          const reopenTab = cfg.reopenTab !== false; // Default to true
          
          const tabs = await new Promise(res => chrome.tabs.query({}, res));
          // try to find an open tab with same URL (prefix match ignoring hash/query)
          const normalize = u => u && u.split('#')[0].split('?')[0];
          const targetNorm = normalize(best.url);
          const existing = tabs.find(t => normalize(t.url) === targetNorm);
          
          if (existing) {
            if (reopenTab) {
              // Close the existing tab first, then open a new one
              await new Promise(res => chrome.tabs.remove(existing.id, res));
              console.log('[BookmarkFinder] Closed existing tab for reopen:', existing.id);
              const created = await new Promise(res => chrome.tabs.create({ url: best.url }, res));
              openResult = { 
                action: 'reopened', 
                tabId: created.id, 
                url: created.url 
              };
            } else {
              // Just activate the existing tab
              await new Promise(res => chrome.tabs.update(existing.id, { active: true }, res));
              console.log('[BookmarkFinder] Activated existing tab:', existing.id);
              openResult = { 
                action: 'activated', 
                tabId: existing.id, 
                url: existing.url 
              };
            }
          } else {
            // Create a new tab
            const created = await new Promise(res => chrome.tabs.create({ url: best.url }, res));
            openResult = { 
              action: 'created', 
              tabId: created.id, 
              url: created.url 
            };
          }
        } catch (e) {
          console.error('[BookmarkFinder] Failed to open bookmark url', e);
          openResult = { action: 'error', error: String(e) };
        }
      }

      sendResponse({ best: best, candidates: matchedBookmarks, opened: openResult });
    })();
    return true;
  }
});
