// Content script: listens for messages from the popup to inject a button into the page

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'inject-button') {
    injectButton(msg.text || 'Click');
    sendResponse({ inserted: true });
  }
});

function injectButton(text) {
  if (document.getElementById('ce-starter-btn')) return; // idempotent
  const btn = document.createElement('button');
  btn.id = 'ce-starter-btn';
  btn.textContent = text;
  btn.style.position = 'fixed';
  btn.style.bottom = '12px';
  btn.style.right = '12px';
  btn.style.zIndex = 999999;
  btn.style.padding = '8px 12px';
  btn.style.background = '#1a73e8';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.borderRadius = '6px';
  btn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'from-content', text: 'button-clicked' }, (resp) => {
      console.log('Background responded', resp);
    });
  });
  document.body.appendChild(btn);
}
