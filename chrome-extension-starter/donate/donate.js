// Donate page with i18n support

// Apply translations to page
function applyTranslations() {
  // Translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = window.i18n.t(key);
  });
}

// Wait for i18n to be ready
(async function() {
  await window.i18n.init();
  applyTranslations();
  
  // Detect user region (China or International)
  function detectRegion() {
    const locale = window.i18n.currentLocale;
    return locale === 'zh-CN' ? 'china' : 'international';
  }

  // Payment configuration
  const paymentConfig = {
    buyMeACoffeeLink: 'https://buymeacoffee.com/wuweiliang', // Replace with your actual Buy Me a Coffee link
    wechatQR: '../icons/wechat_qr.png' // Replace with your actual WeChat QR code image
  };

  const region = detectRegion();
  
  // Show appropriate payment section
  if (region === 'china') {
    document.getElementById('chinaSection').style.display = 'block';
    document.getElementById('internationalSection').style.display = 'none';
    document.getElementById('wechatQR').src = paymentConfig.wechatQR;
    document.getElementById('buyMeACoffeeLinkChina').href = paymentConfig.buyMeACoffeeLink;
  } else {
    document.getElementById('chinaSection').style.display = 'none';
    document.getElementById('internationalSection').style.display = 'block';
    document.getElementById('wechatQRIntl').src = paymentConfig.wechatQR;
    document.getElementById('buyMeACoffeeLinkIntl').href = paymentConfig.buyMeACoffeeLink;
  }

  // Back link handler
  document.getElementById('backLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.close();
  });
})();
